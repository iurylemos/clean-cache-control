# BDD Specs

## Narrativa 1

```
    Como um cliente online
    Quero que o sistema me mostre minhas compras
    Para eu poder controlar minhas despesas
```

## Narrativa 2

```
    Como um cliente offline
    Quero que o sistema me mostre minhas últimas compras gravadas
    Para eu poder ver minhas despesas mesmo sem ter internet
```

## Cenários
```
    Dado que o cliente não tem conexão com a internet
        E existe algum dado gravado no cache
        E os dados do cache forem mais novo que 3 dias
    Quando o cliente solicitar para carregar suas compras
        E então o sistema deve exibir suas compras vindas do cache

    Dado que o cliente não tem conexão com a internet
        E existe algum dado gravado no cache
        E os dados do cache forem mais velhos ou iguais a 3 dias
    Quando o cliente solicitar para carregar suas compras
        E então o sistema deve exibir uma mensagem de erro

    Dado que o cliente não tem conexão com a internet
        E o cache esteja vázio
    Quando o cliente solciitar para carregar suas compras
        E então o sistema deve exibir uma mensagem de erro
```