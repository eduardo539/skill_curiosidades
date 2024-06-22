/* *
 * This sample demonstrates handling intents from an Alexa skill using the Alexa Skills Kit SDK (v2).
 * Please visit https://alexa.design/cookbook for additional examples on implementing slots, dialog management,
 * session persistence, api calls, and more.
 * */
const Alexa = require('ask-sdk-core');

// i18n dependencies. i18n is the main module, sprintf allows us to include variables with '%s'.
const i18n = require('i18next');
const sprintf = require('i18next-sprintf-postprocessor');


const languageStrings = {
    en: {
        translation: {
            WELCOME_MESSAGE: 'Welcome to the fascinating world of the Voyager probe! To start, you can say: Tell me about voyager. How can I assist you on this cosmic journey?',
            HELP_MESSAGE: 'Struggling to communicate with the depths of space? How can I assist you with Voyager facts?',
            GOODBYE_MESSAGE: 'Farewell, star traveler! May your journey through the cosmos be filled with wonder.',
            REFLECTOR_MESSAGE: 'You just triggered %s, an echo from the vastness of space!',
            FALLBACK_MESSAGE: 'Apologies, I\'m not familiar with that cosmic query. Please try again with a Voyager fact.',
            ERROR_MESSAGE: 'Oops, something went wrong on this space voyage. Please try again with a Voyager fact.'
        }
    },
    es: {
        translation: {
            WELCOME_MESSAGE: '¡Bienvenido al fascinante mundo de la sonda Voyager! Para comenzar, puedes decir: Hablame del voyager. ¿Cómo puedo asistirte en este viaje cósmico?',
            HELP_MESSAGE: '¿Tienes problemas para comunicarte con las profundidades del espacio? ¿Cómo puedo asistirte con las curiosidades de la sonda Voyager?',
            GOODBYE_MESSAGE: '¡Hasta luego, viajero estelar! Que tu viaje por el cosmos esté lleno de maravillas.',
            REFLECTOR_MESSAGE: '¡Acabas de activar %s, un eco de la vastedad del espacio!',
            FALLBACK_MESSAGE: 'Disculpa, no estoy familiarizado con esa consulta cósmica. Por favor, inténtalo de nuevo con una curiosidad sobre la Voyager.',
            ERROR_MESSAGE: 'Vaya, algo salió mal en este viaje espacial. Por favor, inténtalo de nuevo con una curiosidad sobre la Voyager.'
        }
    }
};


const GET_FRASES_MSG_EN = 'The interesting fact is... ';
const GET_FRASES_MSG_ES = 'El dato interesante es... ';

const dataEn = [
    'Pioneering in interstellar space: Voyager 1 is the first spacecraft to reach interstellar space, crossing the heliopause in August 2012.',
    'Historic launch: It was launched on September 5, 1977, just 16 days after its twin spacecraft, Voyager 2.',
    'Encounter with Jupiter: Voyager 1 made its first encounter with Jupiter in March 1979, providing the first detailed images of Jupiter\'s atmosphere and its moons.',
    'Encounter with Saturn: In November 1980, Voyager 1 made a close flyby of Saturn, studying its rings and discovering details about its moon Titan.',
    'The Golden Record: Voyager 1 carries a golden record with sounds and images from Earth, designed to communicate the diversity of life and human culture to potential extraterrestrials. It includes greetings in 55 languages, music from various cultures, and sounds of nature.',
    'Mission duration: Although originally planned to last only a few years, the mission has far exceeded its expected lifetime and continues to send data.',
    'Propulsion and power: Voyager 1 is powered by radioisotope thermoelectric generators, which convert heat from the decay of plutonium-238 into electricity. This allows it to operate in the cold and dark regions of interstellar space.',
    'Communication: Despite being more than 22 billion kilometers from Earth, Voyager 1 continues to communicate with NASA via the Deep Space Network.',
    'Interstellar messages: In addition to the golden record, the spacecraft carries a plaque with a pictorial message intended for potential extraterrestrials, describing the origin and creators of the spacecraft.',
    'Continuous exploration: Voyager 1 is expected to continue sending data until its generators can no longer produce enough power, which could be until the 2030s.',
    'Speed and distance: Voyager 1 is the farthest and fastest human-made object, traveling at approximately 61,000 km/h.',
    'The Great Red Spot: Voyager 1 provided the first detailed images of Jupiter\'s Great Red Spot, a giant storm that has been active for centuries.',
    'Volcanoes on Io: The spacecraft discovered volcanic activity on Io, a moon of Jupiter, marking the first time volcanic activity was observed on another celestial body.',
    'Titan\'s atmosphere: Voyager 1\'s flyby of Titan, Saturn\'s largest moon, revealed it has a dense, nitrogen-rich atmosphere similar to early Earth\'s.',
    'Saturn\'s ring system: The spacecraft provided a detailed view of Saturn\'s complex ring system, discovering new moons and structures within the rings.',
    'Jupiter\'s radiation: Voyager 1 measured Jupiter\'s intense radiation belts, which are thousands of times more powerful than Earth\'s.',
    'Pale Blue Dot: In 1990, Voyager 1 took the iconic "Pale Blue Dot" photograph, showing Earth as a tiny dot in the vastness of space, from a distance of 6 billion kilometers.',
    'Durability: The spacecraft was designed to last five years, but it has operated for more than four decades, sending valuable information about deep space.',
    'Scientific instruments: Voyager 1 carries several scientific instruments to study planets and interstellar space, including cameras, magnetometers, and energy particle detectors.',
    'Legacy: The Voyager mission has revolutionized our understanding of the solar system, providing data that has led to countless scientific discoveries and continues to inspire future space exploration missions.'
];

const dataEs = [
    'Pionera en el espacio interestelar: Voyager 1 es la primera sonda en alcanzar el espacio interestelar, cruzando la heliopausa en agosto de 2012.',
    'Lanzamiento histórico: Fue lanzada el 5 de septiembre de 1977, apenas 16 días después de su sonda gemela, Voyager 2.',
    'Encuentro con Júpiter: Voyager 1 hizo su primer encuentro con Júpiter en marzo de 1979, proporcionando las primeras imágenes detalladas de la atmósfera de Júpiter y sus lunas.',
    'Encuentro con Saturno: En noviembre de 1980, Voyager 1 realizó un sobrevuelo cercano de Saturno, estudiando sus anillos y descubriendo detalles sobre su luna Titán.',
    'El disco de oro: Voyager 1 lleva un disco de oro con sonidos e imágenes de la Tierra, diseñado para comunicar la diversidad de la vida y la cultura humanas a posibles seres extraterrestres. Incluye saludos en 55 idiomas, música de diversas culturas y sonidos de la naturaleza.',
    'Duración de la misión: Aunque originalmente planeada para durar sólo unos años, la misión ha superado con creces su expectativa de vida y continúa enviando datos.',
    'Propulsión y energía: Voyager 1 funciona con generadores termoeléctricos de radioisótopos, que convierten el calor de la descomposición del plutonio-238 en electricidad. Esto le permite seguir operando en las frías y oscuras regiones del espacio interestelar.',
    'Comunicación: A pesar de estar a más de 22 mil millones de kilómetros de la Tierra, Voyager 1 sigue comunicándose con la NASA mediante la Red del Espacio Profundo (Deep Space Network).',
    'Mensajes interestelares: Además del disco de oro, la sonda lleva una placa con un mensaje pictórico destinado a posibles extraterrestres, describiendo el origen y los creadores de la sonda.',
    'Exploración continua: Se espera que Voyager 1 continúe enviando datos hasta que sus generadores no puedan producir suficiente energía, lo que podría ser hasta la década de 2030.',
    'Velocidad y distancia: Voyager 1 es el objeto hecho por el hombre que ha viajado más lejos y más rápido, moviéndose a una velocidad de aproximadamente 61,000 km/h.',
    'La Gran Mancha Roja: Voyager 1 proporcionó las primeras imágenes detalladas de la Gran Mancha Roja de Júpiter, una tormenta gigantesca que ha estado activa durante siglos.',
    'Volcanes en Io: La sonda descubrió actividad volcánica en Io, una luna de Júpiter, siendo la primera vez que se observaba actividad volcánica en otro cuerpo celeste.',
    'Atmosfera de Titán: El sobrevuelo de Voyager 1 sobre Titán, la mayor luna de Saturno, reveló que tiene una atmósfera densa y rica en nitrógeno, similar a la de la Tierra primitiva.',
    'Sistema de Anillos de Saturno: La sonda proporcionó una vista detallada del complejo sistema de anillos de Saturno, descubriendo nuevas lunas y estructuras dentro de los anillos.',
    'Radiación de Júpiter: Voyager 1 midió los intensos cinturones de radiación de Júpiter, que son miles de veces más potentes que los de la Tierra.',
    'Pale Blue Dot: En 1990, Voyager 1 tomó la icónica fotografía conocida como el "Punto Azul Pálido", mostrando la Tierra como un pequeño punto en la vastedad del espacio, a una distancia de 6 mil millones de kilómetros.',
    'Durabilidad: La sonda fue diseñada para durar cinco años, pero ha operado más de cuatro décadas, enviando valiosa información sobre el espacio profundo.',
    'Instrumentos científicos: Voyager 1 lleva varios instrumentos científicos para estudiar los planetas y el espacio interestelar, incluyendo cámaras, magnetómetros, y detectores de partículas de energía.',
    'Legado: La misión Voyager ha revolucionado nuestro entendimiento del sistema solar, proporcionando datos que han llevado a innumerables descubrimientos científicos y continúa inspirando futuras misiones de exploración espacial.'
];




const LaunchRequestHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'LaunchRequest';
    },
    handle(handlerInput) {
        const requestAttributes = handlerInput.attributesManager.getRequestAttributes();
        const speakOutput = requestAttributes.t('WELCOME_MESSAGE');

        return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt(speakOutput)
            .getResponse();
    }
};


const FrasesIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'FrasesIntent';
    },
    handle(handlerInput) {
        const locale = handlerInput.requestEnvelope.request.locale;
        const requestAttributes = handlerInput.attributesManager.getRequestAttributes();
        let speakOutput;
        let randomFact;

        if (locale.startsWith('es')) {
            const randomIndex = Math.floor(Math.random() * dataEs.length);
            randomFact = dataEs[randomIndex];
            speakOutput = `${GET_FRASES_MSG_ES} ${randomFact}. Puedes pedir más curiosidades si lo deseas. ¿En qué más te puedo ayudar?`;
        } else {
            const randomIndex = Math.floor(Math.random() * dataEn.length);
            randomFact = dataEn[randomIndex];
            speakOutput = `${GET_FRASES_MSG_EN} ${randomFact}. You can ask for more curiosities if you wish. What else can I help you with?`;
        }

        return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt(requestAttributes.t('HELP_MESSAGE'))
            .getResponse();
    }
};



const HelpIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'AMAZON.HelpIntent';
    },
    handle(handlerInput) {
        const requestAttributes = handlerInput.attributesManager.getRequestAttributes();
        const speakOutput = requestAttributes.t('HELP_MESSAGE');

        return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt(speakOutput)
            .getResponse();
    }
};

const CancelAndStopIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && (Alexa.getIntentName(handlerInput.requestEnvelope) === 'AMAZON.CancelIntent'
                || Alexa.getIntentName(handlerInput.requestEnvelope) === 'AMAZON.StopIntent');
    },
    handle(handlerInput) {
        const requestAttributes = handlerInput.attributesManager.getRequestAttributes();
        const speakOutput = requestAttributes.t('GOODBYE_MESSAGE');

        return handlerInput.responseBuilder
            .speak(speakOutput)
            .getResponse();
    }
};
/* *
 * FallbackIntent triggers when a customer says something that doesn’t map to any intents in your skill
 * It must also be defined in the language model (if the locale supports it)
 * This handler can be safely added but will be ingnored in locales that do not support it yet 
 * */
const FallbackIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'AMAZON.FallbackIntent';
    },
    handle(handlerInput) {
        const requestAttributes = handlerInput.attributesManager.getRequestAttributes();
        const speakOutput = requestAttributes.t('FALLBACK_MESSAGE');

        return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt(speakOutput)
            .getResponse();
    }
};
/* *
 * SessionEndedRequest notifies that a session was ended. This handler will be triggered when a currently open 
 * session is closed for one of the following reasons: 1) The user says "exit" or "quit". 2) The user does not 
 * respond or says something that does not match an intent defined in your voice model. 3) An error occurs 
 * */
const SessionEndedRequestHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'SessionEndedRequest';
    },
    handle(handlerInput) {
        console.log(`~~~~ Session ended: ${JSON.stringify(handlerInput.requestEnvelope)}`);
        // Any cleanup logic goes here.
        return handlerInput.responseBuilder.getResponse(); // notice we send an empty response
    }
};
/* *
 * The intent reflector is used for interaction model testing and debugging.
 * It will simply repeat the intent the user said. You can create custom handlers for your intents 
 * by defining them above, then also adding them to the request handler chain below 
 * */
const IntentReflectorHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest';
    },
    handle(handlerInput) {
        const intentName = Alexa.getIntentName(handlerInput.requestEnvelope);
        const requestAttributes = handlerInput.attributesManager.getRequestAttributes();
        const speakOutput = requestAttributes.t('REFLECTOR_MESSAGE');

        return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt(speakOutput)
            .getResponse();
    }
};
/**
 * Generic error handling to capture any syntax or routing errors. If you receive an error
 * stating the request handler chain is not found, you have not implemented a handler for
 * the intent being invoked or included it in the skill builder below 
 * */
const ErrorHandler = {
    canHandle() {
        return true;
    },
    handle(handlerInput, error) {
        const requestAttributes = handlerInput.attributesManager.getRequestAttributes();
        const speakOutput = requestAttributes.t('ERROR_MESSAGE');
        console.log(`~~~~ Error handled: ${JSON.stringify(error)}`);

        return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt(speakOutput)
            .getResponse();
    }
};

// This request interceptor will log all incoming requests to this lambda
const LoggingRequestInterceptor = {
    process(handlerInput) {
        console.log(`Incoming request: ${JSON.stringify(handlerInput.requestEnvelope.request)}`);
    }
};

// This response interceptor will log all outgoing responses of this lambda
const LoggingResponseInterceptor = {
    process(handlerInput, response) {
      console.log(`Outgoing response: ${JSON.stringify(response)}`);
    }
};

// This request interceptor will bind a translation function 't' to the requestAttributes.
const LocalizationInterceptor = {
  process(handlerInput) {
    const localizationClient = i18n.use(sprintf).init({
      lng: handlerInput.requestEnvelope.request.locale,
      fallbackLng: 'en',
      overloadTranslationOptionHandler: sprintf.overloadTranslationOptionHandler,
      resources: languageStrings,
      returnObjects: true
    });

    const attributes = handlerInput.attributesManager.getRequestAttributes();
    attributes.t = function (...args) {
      return localizationClient.t(...args);
    }
  }
}


/**
 * This handler acts as the entry point for your skill, routing all request and response
 * payloads to the handlers above. Make sure any new handlers or interceptors you've
 * defined are included below. The order matters - they're processed top to bottom 
 * */
exports.handler = Alexa.SkillBuilders.custom()
    .addRequestHandlers(
        LaunchRequestHandler,
        FrasesIntentHandler,
        HelpIntentHandler,
        CancelAndStopIntentHandler,
        FallbackIntentHandler,
        SessionEndedRequestHandler,
        IntentReflectorHandler)
    .addErrorHandlers(
        ErrorHandler)
    .addRequestInterceptors(
        LocalizationInterceptor,
        LoggingRequestInterceptor)
    .addResponseInterceptors(
        LoggingResponseInterceptor)
    .withCustomUserAgent('sample/hello-world/v1.2')
    .lambda();