import { Component } from '@angular/core';
import { AppService } from './app.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {

  constructor(private service: AppService) { }

  isFileSelected = false;
  isUploading = false

  public fileSelected(event: any) {
    this.isFileSelected = true;
    this.isUploading = true;
    let archive = event.target.files[0];
    this.service.getUploadURL().subscribe((data: any) => {
      this.service.doUpload(data, archive).subscribe(() => {
        this.isUploading = false;
      });
    });
  }

  public showCover() {
    chrome.tabs.query({ active: true, currentWindow: true }, tabs => {
      chrome.scripting.executeScript({
        target: { tabId: tabs[0].id! },
        func: showCover
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

const showCover = () => {
  const div = document.getElementById("curtainExtDiv");
  if (div) {
    return;
  }
  const img = document.createElement('img');
  img.src = "https://public-lanzoni.s3.amazonaws.com/images/chrome-extension.png";
  img.style.maxWidth = "100%"
  img.style.height = "100%"
  img.style.verticalAlign = "middle";

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
