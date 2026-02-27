import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ClienteInterface } from '../interfaces/Cliente_interface';

@Injectable({
  providedIn: 'root',
})
export class ClienteService {
  private http: HttpClient = inject(HttpClient);
  urlbase: string = 'http://localhost:8000';

  getCliente_service(): Observable<ClienteInterface[]> {
    return this.http.get<ClienteInterface[]>(`${this.urlbase}/clientes/`);
  }
  saveClient(objetoCliente: ClienteInterface) {
    return this.http.post(`${this.urlbase}/clientes/`, objetoCliente);
  }
  deleteClient(cliente_id: number) {
    return this.http.delete(`${this.urlbase}/clientes/${cliente_id}/`);
  }
}
