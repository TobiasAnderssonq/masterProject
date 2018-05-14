import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from "../../auth.service";
import { User } from "../../models/user";
import { AngularFireDatabase } from 'angularfire2/database-deprecated';

@Component({
	selector: 'app-setusername',
	templateUrl: './setusername.component.html',
	styleUrls: ['./setusername.component.scss'],
	providers: [AuthService, AngularFireDatabase]
})
export class SetusernameComponent implements OnInit {

	constructor(private router: Router, public auth: AuthService,private db: AngularFireDatabase) { }
	usernameCandidate: string;
	user = {} as User;
	usernameAvailable: boolean = false;
	result: any;
	inputField = document.getElementById("username_field");

	ngOnInit() {

	}
	
	goToHome() {
		this.router.navigateByUrl('/home');
	}

	
	async checkUsername() {
		this.user.username = this.user.username.toLowerCase();
		const res = await this.auth.checkUsername(this.user.username).subscribe(username => {
			this.usernameAvailable = !username.$value
		});
	}

	updateUsername() {
		this.auth.updateUsername(this.user.username);
		this.db.object(`scores/`+this.user.username + `/dailyChallenge/`).update({"streak":0, "timestamp":""});
		this.db.object(`scores/`+this.user.username + `/points/`).update({"score":0});
		this.db.object(`scores/`+this.user.username + `/challengeFriend/`).update({"start":0});
		this.db.object(`scores/`+this.user.username + `/challengeWithFriend/`).update({"start":0});
		localStorage.setItem("localuserName", this.user.username);
		this.goToHome();
	}

}
