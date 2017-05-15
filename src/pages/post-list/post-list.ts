import { Component, ElementRef } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { ImgLoader } from 'ionic-image-loader';
import 'rxjs/Rx'

import { ClientService } from '../../services/client.service';

@IonicPage()
@Component({
  selector: 'page-post-list',
  templateUrl: 'post-list.html',
  providers: [ClientService]
})
export class PostListPage {
  private pageTitle: string;
  private options: any;
  private posts: any;
  private imgThumbnail: any;
  private page: number;
  private onProgress: boolean;
  private onInitProgress: boolean;

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    public elementRef: ElementRef,
    public clientService: ClientService) {
    this.pageTitle = navParams.get('name');
    this.options = {
      type: this.navParams.get('type'),
      id: this.navParams.get('id')
    }
    this.page = 1;
    this.fetchPost(this.options);
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad PostListPage');
  }
  ngOnInit(){
    this.imgThumbnail = this.elementRef.nativeElement.getElementsByClassName('post-thumbnail');
  }

  fetchPost(options: any) {
    this.onProgress = true;
    this.clientService.getListPosts(this.page, this.options)
      .subscribe(res => {
        this.onInitProgress = (this.page == 1 ? false : true);
        this.posts = res;
        this.onProgress = false;
      })
  }

  loadMorePosts(infiniteScroll) {
    this.page++;
    setTimeout(() => {
      this.clientService.getListPosts(this.page)
        .subscribe(res => {
          res.forEach(element => {
            this.posts.push(element)
          });
          infiniteScroll.complete();
        })
    }, 500)
  }

  goToPost(id, media) {
    this.navCtrl.push(
      "PostContentPage", {
        'postId': id,
        'postMedia': media
      });
  }

  searchPost(event: any) {
    let searchOptions = {
      type: 'search',
      id: event.target.value
    }
    this.fetchPost(searchOptions);
    this.pageTitle = event.target.value;
  }

  onImageLoad(imgLoader: ImgLoader){
    imgLoader.element.parentElement.parentElement.parentElement.parentElement.className = "fade-in";
  }
}
