import { Component, OnInit } from '@angular/core';

@Component({
    selector: 'app-footbar',
    imports: [],
    standalone: true,
    templateUrl: './footbar.html',
    styleUrl: './footbar.scss'
})
export class Footbar implements OnInit {
    isTargetDomain: boolean = false;
    
    ngOnInit() {
        // 获取当前域名
        const currentDomain = window.location.hostname;
            
        // 判断是否匹配目标地址
        this.isTargetDomain = (currentDomain === 'index.mryan2005.top');
    }
}
