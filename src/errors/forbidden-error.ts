
export function forbiddenError(reason: string){
    let message;
    switch (reason){
        case 'RESERVA':
            message="Você está sem reserva ainda";
            break;
        case 'VAGA':
            message="O quarto escolhido está sem vaga disponível";
            break;
        case 'REMOTO':
            message="O seu evento é remoto";
            break;
        case 'HOSPEDAGEM':
            message="O seu ingresso não inclui hospedagem";
            break;
        case 'PAGO':
            message="Seu pagamento ainda não foi confirmado";
            break;
        default:
            message="Há algo errado"
            break;
    }
    return {
        name: "ForbiddenError",
        message
}
} 