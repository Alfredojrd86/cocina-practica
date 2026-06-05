// Recetas por enfoque. Cada item: { n: nombre, p: preparación }.
// Enfoques:
//   metabolismo  -> Frank Suárez (Dieta 3x1, control de glucosa)
//   animal       -> Paul Saladino (animal-based, nose-to-tail)
//   balanceado   -> mezcla de ambos

const i = (n, p) => ({ n, p });

export const DB = {
  metabolismo: {
    desayunos: [
      i("Huevos revueltos con tomate y palta", "Bate 2-3 huevos y cuécelos en mantequilla a fuego bajo. Añade tomate picado y sirve con palta en rodajas."),
      i("Tortilla de brócoli y queso", "Saltea brócoli, vierte huevos batidos y queso, y cuaja a fuego medio tapado."),
      i("Huevos con tocino y manzana verde", "Fríe el tocino, luego los huevos en su grasa. Acompaña con manzana verde en rodajas."),
      i("Yogur griego con fresas y nueces", "Mezcla yogur griego con fresas en trozos y un puñado de nueces. Sin azúcar; un toque de miel si quieres."),
      i("Huevos fritos con palta y espinaca", "Fríe los huevos en mantequilla y sírvelos sobre espinaca fresca con palta."),
      i("Arepa de queso (porción 3x1)", "Asa una arepa pequeña y rellénala con queso llanero. Recuerda: la arepa es Tipo E, una porción acompaña al plato."),
    ],
    proteinas: [
      i("Pollo a la plancha", "Sazona con sal, ajo y limón. Cocina 5-6 min por lado a fuego medio hasta dorar."),
      i("Cerdo al horno", "Sazona con sal y especias. Hornea a 180°C unos 35-40 min."),
      i("Carne de res a la plancha", "Sal y pimienta. Sella 3-4 min por lado a fuego alto al punto que prefieras."),
      i("Atún", "Escúrrelo y mézclalo con un chorrito de aceite de oliva y limón."),
      i("Sardinas con limón", "Escúrrelas y sírvelas con limón, cebolla salteada y aceite de oliva. Omega-3."),
      i("Huevos cocidos", "Hierve 8-10 min, enfría en agua y pela."),
      i("Pollo al horno con limón", "Adoba con limón, ajo y sal. Hornea a 190°C 35-40 min."),
    ],
    carbos: [
      i("Batata rosada al horno", "Corta en cubos, un poco de aceite y sal. Hornea a 200°C 25-30 min. Tipo E: 1/4 del plato."),
      i("Plátano verde hervido", "Pélalo y hiérvelo 15-20 min hasta que esté tierno. Tipo E: porción chica."),
      i("Yuca sancochada", "Pela, corta y hierve 20-25 min hasta tierna. Tipo E: 1/4 del plato."),
    ],
    vegetales: [
      i("Ensalada de lechuga y tomate", "Trocea lechuga y tomate. Aliña con aceite de oliva, limón y sal."),
      i("Brócoli al vapor", "Cuece al vapor 5-7 min hasta que esté verde y tierno."),
      i("Espinaca salteada con ajo", "Saltea espinaca con ajo y aceite de oliva 2-3 min hasta marchitar."),
      i("Pimentón asado", "Ásalo en tiras a fuego alto hasta que se ablande."),
      i("Ensalada de pepino", "Corta el pepino en rodajas y aliña con limón, sal y aceite de oliva."),
    ],
    grasas: [
      i("Palta", "En rodajas o cubos, con un toque de sal y limón."),
      i("Aceite de oliva", "Un chorrito en crudo sobre el plato al servir."),
      i("Queso llanero", "En cubos o lonjas para acompañar."),
      i("Puñado de frutos secos", "Un puñado al natural, sin sal añadida."),
      i("Mantequilla", "Una cucharadita para cocinar o sobre las verduras."),
    ],
    snacks: [
      i("Manzana verde", "En rodajas, sola."),
      i("Puñado de frutos secos", "Un puñado al natural."),
      i("Huevo duro", "Hervido 8-10 min, con una pizca de sal."),
      i("Queso con nueces", "Unos cubos de queso con un puñado de nueces."),
      i("Yogur griego con fresas", "Fresas en trozos con yogur griego, sin azúcar."),
    ],
  },

  animal: {
    desayunos: [
      i("Huevos con tocino", "Fríe tocino crujiente y los huevos al gusto en la misma sartén."),
      i("Huevos revueltos en mantequilla", "Bate y cuécelos a fuego bajo en mantequilla, removiendo."),
      i("Tortilla con queso", "Huevos batidos con queso, cuaja a fuego medio."),
      i("Cerdo con huevos", "Saltea cerdo en trozos y añade huevos hasta cuajar."),
      i("Huevos fritos con palta", "Fríe en mantequilla y sirve con palta en rodajas."),
    ],
    proteinas: [
      i("Carne de res", "Sella a fuego alto con sal, 3-4 min por lado."),
      i("Hígado de res al sartén", "Corta fino, sella 1-2 min por lado en mantequilla con cebolla. No pasarlo. Bomba de vitamina A, B12 y cobre. 1x/semana."),
      i("Cerdo al horno", "Sal y especias. Hornea a 180°C 35-40 min."),
      i("Pollo con piel", "Hornea con piel a 200°C 35 min hasta dorar y crujir."),
      i("Sardinas con sal marina", "Escúrrelas y sírvelas con sal marina y limón. Omega-3 y calcio."),
      i("Atún", "Con un chorrito de aceite de oliva y limón."),
      i("Huevos", "Al gusto: revueltos, fritos o cocidos."),
      i("Tocino con huevos", "Fríe el tocino y cuece los huevos en su grasa."),
    ],
    carbos: [
      i("Manzana verde", "En rodajas, fresca."),
      i("Fresas", "Lavadas, al natural."),
      i("Miel cruda", "Una cucharada como dulce natural. Saladino la aprueba."),
    ],
    vegetales: [
      i("Brócoli con mantequilla", "Al vapor y luego salteado con una nuez de mantequilla."),
      i("Espinaca con mantequilla", "Saltea espinaca en mantequilla con sal 2-3 min."),
      i("Lechuga con aceite de oliva", "Trocea y aliña con aceite de oliva y sal."),
    ],
    grasas: [
      i("Mantequilla", "Para cocinar o derretir sobre la carne."),
      i("Palta", "En rodajas con sal."),
      i("Queso llanero", "En lonjas o cubos."),
      i("Aceite de oliva", "Un chorrito en crudo."),
      i("Tocino", "Frito hasta crujir, como acento."),
    ],
    snacks: [
      i("Huevo duro", "Hervido 8-10 min con una pizca de sal."),
      i("Queso", "Unos cubos."),
      i("Tocino", "Un par de lonjas crujientes."),
      i("Manzana roja", "En rodajas, fresca."),
      i("Fresas", "Lavadas, solas."),
    ],
  },

  balanceado: {
    desayunos: [
      i("Huevos con palta y tomate", "Huevos al gusto con palta en rodajas y tomate."),
      i("Yogur griego con arándanos y nueces", "Yogur griego con arándanos frescos y nueces. Un toque de miel opcional."),
      i("Tortilla de espinaca y queso", "Huevos batidos con espinaca picada y queso, cuaja en sartén."),
      i("Huevos con caraotas y palta", "Huevos al gusto con caraotas negras cocidas y palta. Porción de caraotas Tipo E."),
      i("Arepa con queso y huevo", "Arepa pequeña rellena de queso llanero y huevo. La arepa es la porción de almidón del plato."),
    ],
    proteinas: [
      i("Pollo a la plancha", "Sazona con sal y limón. 5-6 min por lado a fuego medio."),
      i("Cerdo magro", "A la plancha con sal y especias, 5 min por lado."),
      i("Carne de res", "Sella con sal y pimienta, 3-4 min por lado."),
      i("Hígado de res", "Sella fino 1-2 min por lado en mantequilla con cebolla. 1x/semana por sus micronutrientes."),
      i("Sardinas / atún", "Con aceite de oliva y limón. Omega-3."),
      i("Huevos", "Al gusto."),
      i("Lentejas guisadas", "Cuece con cebolla y ajo 25-30 min hasta tiernas. Tipo E: 1/4 del plato."),
    ],
    carbos: [
      i("Batata rosada", "En cubos al horno, 200°C 25-30 min."),
      i("Caraotas negras", "Cocidas con cebolla, ajo y pimentón."),
      i("Yuca sancochada", "Hervida 20-25 min hasta tierna."),
      i("Plátano verde", "Hervido 15-20 min."),
      i("Lentejas", "Cocidas con cebolla y ajo."),
    ],
    vegetales: [
      i("Ensalada mixta", "Lechuga, tomate y pepino. Aliña con aceite de oliva y limón."),
      i("Brócoli al vapor", "Al vapor 5-7 min."),
      i("Espinaca salteada", "Con ajo y aceite de oliva, 2-3 min."),
      i("Pimentón", "Asado o salteado en tiras."),
      i("Cebolla salteada con tomate", "Sofríe la cebolla en aceite hasta transparente y añade tomate. Siempre cocida."),
    ],
    grasas: [
      i("Palta", "En rodajas con sal y limón."),
      i("Aceite de oliva", "Un chorrito en crudo."),
      i("Frutos secos", "Un puñado al natural."),
      i("Queso llanero o gouda", "En cubos o lonjas."),
      i("Mantequilla", "Una cucharadita para cocinar."),
    ],
    snacks: [
      i("Manzana verde o roja", "En rodajas, sola."),
      i("Yogur griego", "Solo o con fresas."),
      i("Puñado de frutos secos", "Al natural."),
      i("Huevo duro", "Con una pizca de sal."),
      i("Queso con manzana verde", "Unos cubos de queso llanero con rodajas de manzana verde."),
    ],
  },
};
