import { Component } from '@angular/core';
import { faFolder, faFolderTree } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-registry',
  templateUrl: './registry.component.html',
  styleUrls: ['./registry.component.scss']
})
export class RegistryComponent {
  faFolderTree = faFolderTree
  faFolder = faFolder
}
