import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Servico } from '../interfaces/Servico_interface';

@Injectable({
    providedIn: 'root',
})
export class ServicoService {
    private http: HttpClient = inject(HttpClient);
    urlbase: string = 'http://localhost:8000';

    getServico_service(): Observable<Servico[]> {
        return this.http.get<Servico[]>(`${this.urlbase}/Servico/`);
    }
    saveServico(servico_service: Servico) {
        return this.http.post(`${this.urlbase}/Servico/`, servico_service);
    }
    deleteServico(Servico_id: number) {
        return this.http.delete(`${this.urlbase}/Servico/${ServicoService}/`);
    }
}  