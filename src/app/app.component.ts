import { Component } from '@angular/core';
import { ImageService } from './image.service';
import { StorageService } from './storage.service';
import { environment } from '../environments/environment';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {

  constructor(private service: ImageService, private storageService: StorageService) {
    const storageValue = storageService.getField('imgUrl');
    this.imgUrl = storageValue ? storageValue : '';
   }

  isFileSelected = false;
  isUploading = false
  imgUrl: string;

  public fileSelected(event: any) {
    this.isFileSelected = true;
    this.isUploading = true;
    let archive = event.target.files[0];
    this.service.uploadFile(archive).subscribe((data: any) => {
      this.isUploading = false;
      this.imgUrl = data;
      this.storageService.setField('imgUrl', data, environment.expirationInSeconds);
    });
  }

  public lockShowButton() {
    return this.isUploading || this.imgUrl === "";
  }

  public showCover() {
    chrome.tabs.query({ active: true, currentWindow: true }, tabs => {
      chrome.scripting.executeScript({
        target: { tabId: tabs[0].id! },
        func: show,
        args: [this.imgUrl],
      });
    });
  }

  public deleteCover() {
    chrome.tabs.query({ active: true, currentWindow: true }, tabs => {
      chrome.scripting.executeScript({
        target: { tabId: tabs[0].id! },
        func: deleteCover
      });
    });
  }

}

const deleteCover = () => {
  const div = document.getElementById("curtainExtDiv");
  if (div) {
    div.remove();
  }
}

const show = (imageUrl: string) => {
  const div = document.getElementById("curtainExtDiv");
  if (div) {
    return;
  }
  const img = document.createElement('img');
  img.src = imageUrl;
  img.style.maxWidth = "100%"
  img.style.height = "100%"
  img.style.verticalAlign = "middle";
  img.style.position = "absolute";
  img.style.top = "0";
  img.style.left = "0";
  img.loading = "lazy";

  const helper = document.createElement("span");
  helper.style.display = "inline-block";
  helper.style.height = "100%";
  helper.style.verticalAlign = "middle";

  const newDiv = document.createElement("div");
  newDiv.setAttribute("id", "curtainExtDiv");
  newDiv.style.backgroundColor = "black";
  newDiv.style.position = "absolute";
  newDiv.style.top = "0";
  newDiv.style.left = "0";
  newDiv.style.width = "100%";
  newDiv.style.height = "100%";
  newDiv.style.zIndex = "1000000";
  newDiv.style.textAlign = "center";

  newDiv.appendChild(helper);
  newDiv.appendChild(img);

  document.body.appendChild(newDiv);
}
