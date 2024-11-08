interface Card {
  id: number;
  text: string;
  used: boolean;
}

interface CardDeck {
  [key: string]: {
    color: string;
    bgColor: string;
    cards: Card[];
  };
}

export const CARD_DECKS: CardDeck = {
  red: {
    color: '#DC2626', // text-red-600
    bgColor: '#FEE2E2', // bg-red-100
    cards: [
      { id: 1, text: 'JUGAR IMPLICA COMPETIR CON OTRAS Y OTROS.', used: false },
      { id: 2, text: 'JUGAR PERMITE EXPRESAR FANTASIAS.', used: false },
      { id: 3, text: 'JUGAR ES OBLIGATORIO.', used: false },
      { id: 4, text: 'JUGAR SIEMPRE IMPLICA APOSTAR.', used: false },
      { id: 5, text: 'EL JUEGO PRODUCE TENSION.', used: false },
      { id: 6, text: 'JUGAR ES UN DERECHO.', used: false },
      { id: 7, text: 'JUGAR ES TRABAJAR.', used: false },
      { id: 8, text: 'EL RESULTADO DE UN JUEGO DEPENDE DE LOS ALGORITMOS.', used: false },
      { id: 9, text: 'SI SE JUEGA BIEN AL FÚTBOL SE TIENE ÉXITO EN EL JUEGO ONLINE.', used: false },
      { id: 10, text: 'JUGAR PUEDE TRANSFORMAR LA REALIDAD.', used: false },
      { id: 11, text: 'JUGAR REQUIERE DISCIPLINA.', used: false },
      { id: 12, text: 'AL JUGAR SE CONOCEN NUEVAS AMIGAS Y NUEVOS AMIGOS.', used: false }
    ]
  },
  blue: {
    color: '#2563EB', // text-blue-600
    bgColor: '#DBEAFE', // bg-blue-100
    cards: [
      { id: 1, text: 'GANAR ES FACIL.', used: false },
      { id: 2, text: 'JUGAR TE PERMITE VIVENCIAR OTRA REALIDAD.', used: false },
      { id: 3, text: 'JUGAR DISTRAE.', used: false },
      { id: 4, text: 'APOSTAR NO ES JUGAR.', used: false },
      { id: 5, text: 'JUGAR ES DIVERTIDO.', used: false },
      { id: 6, text: 'JUGAR ES SOLO PARA NIÑAS Y NIÑOS.', used: false },
      { id: 7, text: 'JUGAR DESPIERTA LA CREATIVIDAD.', used: false },
      { id: 8, text: 'JUGAR SIEMPRE ES LEGAL.', used: false },
      { id: 9, text: 'LOS JUEGOS EXPONEN A RIESGOS.', used: false },
      { id: 10, text: 'EN EL JUEGO SE PUEDE SER DE OTRO MODO.', used: false },
      { id: 11, text: 'EL RESULTADO DEL JUEGO DEPENDE DEL AZAR.', used: false },
      { id: 12, text: 'JUGAR DESPIERTA PASIONES.', used: false }
    ]
  },
  green: {
    color: '#059669', // text-emerald-600
    bgColor: '#D1FAE5', // bg-emerald-100
    cards: [
      { id: 1, text: 'EL JUEGO SIEMPRE TIENE REGLAS.', used: false },
      { id: 2, text: 'LA PUBLICIDAD INFLUYE EN LA ELECCIÓN DE LOS JUEGOS.', used: false },
      { id: 3, text: 'JUGAR DA PLACER.', used: false },
      { id: 4, text: 'SE JUEGA PARA GANAR.', used: false },
      { id: 5, text: 'JUGAR PROVOCA EXCITACIÓN.', used: false },
      { id: 6, text: 'JUGAR ES UNA PÉRDIDA DE TIEMPO.', used: false },
      { id: 7, text: 'EN EL JUEGO SE APRENDEN DISTINTAS REGLAS SOCIALES.', used: false },
      { id: 8, text: 'EN EL JUEGO TODO ES GANANCIA.', used: false },
      { id: 9, text: 'LOS VARONES CONSUMEN MÁS JUEGOS DE APUESTA.', used: false },
      { id: 10, text: 'EL JUEGO ES UN OBJETO DE CONSUMO.', used: false },
      { id: 11, text: 'EL RESULTADO DEL JUEGO DEPENDE DE LAS HABILIDADES DE LAS/OS JUGADORAS/ES.', used: false },
      { id: 12, text: 'CUANDO LA PERSONA QUIERE PARAR EL JUEGO PUEDE HACERLO.', used: false }
    ]
  },
  purple: {
    color: '#7C3AED', // text-violet-600
    bgColor: '#EDE9FE', // bg-violet-100
    cards: [
      { id: 1, text: 'AL JUGAR TODAS/OS ACEPTAN LAS REGLAS.', used: false },
      { id: 2, text: 'LAS REDES SOCIALES INDUCEN DIFERENTES PRÁCTICAS DE JUEGO.', used: false },
      { id: 3, text: 'LOS JUEGOS GENERAN COMPULSIÓN.', used: false },
      { id: 4, text: 'PERDER INVALIDA EL JUGAR.', used: false },
      { id: 5, text: 'JUGAR RELAJA.', used: false },
      { id: 6, text: 'SE APRENDE JUGANDO.', used: false },
      { id: 7, text: 'ALGUNOS JUEGOS ONLINE TIENEN COSTO ECONÓMICO.', used: false },
      { id: 8, text: 'LAS DEUDAS DE JUEGO SE PAGAN.', used: false },
      { id: 9, text: 'JUGAR ABURRE.', used: false },
      { id: 10, text: 'JUGAR ENTRETIENE.', used: false },
      { id: 11, text: 'JUGAR PUEDE ALTERAR LA ORGANIZACIÓN DEL TIEMPO.', used: false },
      { id: 12, text: 'LAS MUJERES TIENEN MENOS INTERÉS POR LOS JUEGOS ONLINE.', used: false }
    ]
  }
};