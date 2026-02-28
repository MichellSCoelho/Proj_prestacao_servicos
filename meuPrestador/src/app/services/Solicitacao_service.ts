import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Solicitacao } from '../interfaces/Solicitacao_interface';


@Injectable({
    providedIn: 'root',
})
export class Solicitacao_service {
    private http: HttpClient = inject(HttpClient);
    urlbase: string = 'http://localhost:8000';

    getSolicitacao_service(): Observable<Solicitacao_service[]> {
        return this.http.get<Solicitacao_service[]>(`${this.urlbase}/solicitacoes/`);
    }
    saveSolicitacao(solicitacao_service: Solicitacao) {
        return this.http.post(`${this.urlbase}/servicos/`, solicitacao_service);
    }
    deleteSolicitacao(Solicitacao_id: number) {
        return this.http.delete(`${this.urlbase}/solicitacoes/${Solicitacao_service}/`);
    }
};