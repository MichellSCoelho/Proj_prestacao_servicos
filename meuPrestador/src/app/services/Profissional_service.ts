import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Profissional } from '../interfaces/Profissional_interface';

@Injectable({
    providedIn: 'root',
})
export class Profissional_service {
    private http: HttpClient = inject(HttpClient);
    urlbase: string = 'http://localhost:8000';

    getProfissionaisPorServico(servico_id: number) {
        return this.http.get<Profissional[]>(
            `${this.urlbase}/Profissional/?servicos=${servico_id}`
        );
    }
    saveProfissional(profissional_service: Profissional) {
        return this.http.post(`${this.urlbase}/Profissional/`, profissional_service);
    }
    deleteProfissional(Profissiona_id: number) {
        return this.http.delete(`${this.urlbase}/Profissional/${Profissional_service}/`);
    }
}  
