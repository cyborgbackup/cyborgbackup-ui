import { Component } from '@angular/core';

@Component({
  selector: 'ngx-footer',
  styleUrls: ['./footer.component.scss'],
  template: `
    <span class="created-by"><a href="https://cyborgbackup.dev" target="_blank">CyBorgBackup</a> 2021</span>
    <div class="socials">
      <a href="https://github.com/cyborgbackup/cyborgbackup" target="_blank" class="ion ion-social-github"></a>
    </div>
  `,
})
export class FooterComponent {
}
