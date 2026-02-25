from django.contrib import admin
from .models import Cliente, Profissional, Servico, Solicitacao

admin.site.register(Cliente)
admin.site.register(Profissional)
admin.site.register(Servico)
admin.site.register(Solicitacao)