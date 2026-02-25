from django.shortcuts import render

from django_filters.rest_framework import DjangoFilterBackend
from .filters import ClienteFilter, ProfissionalFilter, ServicoFilter, SolicitacaoFilter
from rest_framework import viewsets, permissions
from .models import Cliente, Profissional, Servico, Solicitacao
from .Serializers import *

class ClienteViewSet(viewsets.ModelViewSet):
    queryset = Cliente.objects.all()
    serializer_class = ClienteSerializer
    filter_backends = [DjangoFilterBackend]
    filterset_class = ClienteFilter


class ProfissionalViewSet(viewsets.ModelViewSet):
    queryset = Profissional.objects.all()
    serializer_class = ProfissionalSerializer
    filter_backends = [DjangoFilterBackend]
    filterset_class = ProfissionalFilter


class ServicoViewSet(viewsets.ModelViewSet):
    queryset = Servico.objects.all()
    serializer_class = ServicoSerializer
    filter_backends = [DjangoFilterBackend]
    filterset_class = ServicoFilter


class SolicitacaoViewSet(viewsets.ModelViewSet):
    queryset = Solicitacao.objects.all()
    serializer_class = SolicitacaoSerializer
    filter_backends = [DjangoFilterBackend]
    filterset_class = SolicitacaoFilter