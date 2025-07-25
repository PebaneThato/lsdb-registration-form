// auth.service.ts

import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Router } from '@angular/router';

@Injectable({
    providedIn: 'root',
})
export class AuthService {

    private currentUserSubject: BehaviorSubject<any>;

    constructor(private http: HttpClient, private router: Router) {
        this.currentUserSubject = new BehaviorSubject<any>(JSON.parse(localStorage.getItem('currentUser')!));
    }

    login(email: string, password: string): Observable<any> {
        return this.http
            .post<any>('/api/login.php', { email, password })
            .pipe(
                catchError(error => {
                    throw error;
                })
            );
    }

    setCurrentSubject(currentSubject: BehaviorSubject<any>) {
        this.currentUserSubject = currentSubject
    }

    logout() {
        localStorage.removeItem('currentUser');
        this.currentUserSubject.next(null);
        this.router.navigate(['/login']);
    }

    get currentUserValue() {
        return this.currentUserSubject.value;
    }

    isAuthenticated() {
        return !!this.currentUserValue;
    }

    isMemberRole() {
        return this.currentUserSubject.value.user_role == 'Member';
    }

    get isProjectManager() {
        return this.currentUserValue.user_role == 'Project Manager';
    }
}
