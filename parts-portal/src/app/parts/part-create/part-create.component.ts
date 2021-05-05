import { Component, OnInit } from "@angular/core";
import { FormGroup, FormControl, Validators } from "@angular/forms";
import { PartService } from "../part.service";
import { ActivatedRoute, ParamMap } from "@angular/router";
import { Part } from "../part.model";
import { mimeType } from './mime-type.validator'
import { environment } from '../../../environments/environment'

@Component({
  selector: "app-part-create",
  templateUrl: "./part-create.component.html",
  styleUrls: ["./part-create.component.css"],
})
export class PartCreateComponent implements OnInit {
  private mode = "create";
  private partId: string;

  isLoading = false;
  part: Part;
  form: FormGroup;
  imagePreview: string;
  BACKEND_URL = environment.imagesURL;

  constructor(
    private partService: PartService,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.form = new FormGroup({
      title: new FormControl(null, {
        validators: [Validators.required, Validators.minLength(3)],
      }),
      content: new FormControl(null, { validators: [Validators.required] }),
      partNumber: new FormControl(null,  { validators: [Validators.required]}),
      image: new FormControl(null,  { validators: [Validators.required], asyncValidators: [mimeType]})
    });

    this.route.paramMap.subscribe((paramMap: ParamMap) => {
      if (paramMap.has("partId")) {
        this.mode = "edit";
        this.partId = paramMap.get("partId");
        this.isLoading = true;

        this.partService.getPart(this.partId).subscribe((result) => {
          this.isLoading = false;
          this.part = {
            id: result[0].id,
            title: result[0].title,
            content: result[0].content,
            partNumber: result[0].partNumber,
            imagePath: result[0].imagePath,
            createdBy: result[0].createdBy
          };

          this.form.setValue({
            title: this.part.title,
            content: this.part.content,
            partNumber: this.part.partNumber,
            image: this.part.imagePath,
          });
          this.imagePreview = `${this.BACKEND_URL}/${this.part.imagePath}`;
        });
      } else {
        this.mode = "create";
        this.partId = null;
      }
    });
  }

  getErrorMessage() {
    return "Please enter a text";
  }

  onSavePost() {
    if (this.form.invalid) {
      return;
    }

    this.isLoading = true;
    if (this.mode == "create") {
      this.partService.addPart( this.form.value.title,
                                this.form.value.content,
                                this.form.value.partNumber,
                                this.form.value.image);
      this.form.reset();
    } else {
      this.partService.updatePart(
        this.partId,
        this.form.value.title,
        this.form.value.content,
        this.form.value.partNumber,
        this.form.value.image,
        this.part.createdBy
      );
    }
  }

  onImagePicked(event: Event){
    const file = (event.target as HTMLInputElement).files[0];
    this.form.patchValue({image: file});
    this.form.get('image').updateValueAndValidity();

    const reader = new FileReader();
    reader.onload = ()=>{
      this.imagePreview =  reader.result as string;
    };
    reader.readAsDataURL(file);
  }
}
