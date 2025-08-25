import React, { createContext, useContext, useState, ReactNode, PropsWithChildren, useEffect } from 'react';
import { Prompt, Category } from '../types';

// A single source of high-quality "ideal" prompts to initialize the app
const idealPrompts: Prompt[] = [
    // Marketing
    { id: 'new-prompt-1', title: 'Secuencia de Email Persuasiva con Neurocopywriting', description: 'Crea una secuencia de 3 emails para un lanzamiento de producto usando técnicas de neurocopywriting.', content: `Actúa como un experto en neurocopywriting especializado en comercio electrónico. Necesito una secuencia de tres emails persuasivos para el lanzamiento de nuestro nuevo producto, 'EcoGlow' (un producto de cuidado de la piel sostenible).
    ◦ Email 1 (Apertura): Utiliza el efecto Zeigarnik dejando una historia o argumento sobre el impacto ambiental de los productos tradicionales inconcluso, motivando al lector a seguir leyendo la secuencia. El objetivo es generar intriga y despertar la curiosidad.
    ◦ Email 2 (Desarrollo): Aplica la prueba social e incluye un testimonio real de un early adopter de 'EcoGlow' y estadísticas sobre la creciente demanda de productos sostenibles en el mercado. Enfócate en los beneficios de la sostenibilidad y la eficacia del producto.
    ◦ Email 3 (Cierre y CTA): Redacta un mensaje que aplique el sesgo de urgencia, incentivando una respuesta rápida para acceder a una oferta limitada de lanzamiento y un descuento por pre-orden.
    ◦ Formato: Estructura cada email con un asunto atractivo, un cuerpo de 150-200 palabras y un claro llamado a la acción (CTA). El tono debe ser profesional, inspirador y directo, enfocado en la solución y el valor para el consumidor consciente.
    ◦ Puntos clave: El diseño de esta secuencia de emails debe alinearse con nuestros objetivos de negocio (aumento de conversiones en pre-lanzamiento) y nuestro ADN empresarial (énfasis en sostenibilidad y responsabilidad social).`, category: Category.Marketing, author: 'Equipo GeniusPrompt', createdAt: '2024-07-01T10:00:00Z', rating: 4.9, downloads: 250, isPublished: true },
    { id: 'new-prompt-2', title: 'Estrategia de Contenido para Startup de IA', description: 'Desarrolla una estrategia de contenido de 3 meses para redes sociales y blog para una startup SaaS.', content: `Como Director de Marketing de una startup de tecnología de IA para pequeñas empresas, necesito que desarrolles una estrategia de contenido para redes sociales y blog para los próximos tres meses.
    ◦ Contexto: Nuestro producto principal es un asistente de IA para gestión de tareas y automatización de procesos internos ('TaskFlow AI'). Nuestro público objetivo son propietarios de PYMES con poco tiempo que buscan eficiencia y reducción de costes operativos.
    ◦ Acciones esperadas:
        1. Temas: Sugiere 10 temas de blog y 15 ideas para posts de Instagram que aborden los puntos de dolor de nuestro público (ej. "demasiadas horas en tareas repetitivas") y posicionen 'TaskFlow AI' como la solución.
        2. Formato: Para el blog, incluye títulos sugeridos y un breve resumen (50 palabras) para cada tema. Para Instagram, propone tipos de contenido (carruseles, reels, preguntas y respuestas) y un ejemplo de copy para 3 de ellos.
        3. Calendario: Organiza las publicaciones sugeridas en un calendario semanal de Instagram para un mes, indicando los días óptimos para publicar y el tipo de contenido.
        4. Tono y estilo: Mantén un tono profesional pero accesible, enfatizando la eficiencia, el ahorro de tiempo y la facilidad de uso.
        5. Reflexión: Incluye una breve sección de razonamiento explicando por qué estos temas y formatos son efectivos para la audiencia de PYMES.`, category: Category.Marketing, author: 'Equipo GeniusPrompt', createdAt: '2024-07-01T11:00:00Z', rating: 4.8, downloads: 310, isPublished: true },
    // Educación
    { id: 'new-prompt-3', title: 'Plan de Clase Universitario con Metodologías Activas', description: 'Diseña un plan de clase de 60 minutos sobre Diseño de Interfaces de Usuario (UI) usando la Taxonomía de Bloom.', content: `Actúa como un experto en planificación de lecciones universitarias con un enfoque en metodologías activas y evaluación por competencias.
    ◦ Diseña un plan de clase de 60 minutos para la asignatura de 'Diseño de Interfaces de Usuario (UI)' sobre el tema 'Principios de Usabilidad y Experiencia de Usuario (UX)'.
    ◦ Actividades de Aprendizaje: Incluye actividades interactivas y participativas que fomenten la comprensión y aplicación de los conceptos. Deben estar divididas en tres niveles de la Taxonomía de Bloom:
        ▪ Básico: Actividad para la adquisición y comprensión de conocimientos (ej. "Lluvia de ideas sobre términos clave de UI/UX").
        ▪ Intermedio: Actividad para la aplicación y análisis de conceptos (ej. "Análisis de usabilidad de una interfaz existente").
        ▪ Avanzado: Actividad para la síntesis, evaluación y creación de nuevo conocimiento (ej. "Diseño de un prototipo de baja fidelidad para un problema de usabilidad dado").
    ◦ Evaluación y Retroalimentación: Diseña una evaluación formativa para el final de la clase y una rúbrica detallada para la actividad avanzada, que refleje las subcompetencias de aprendizaje desarrolladas (ej. "Pensamiento crítico en UX, Aplicación de principios de diseño").
    ◦ Formato: Presenta el plan en una tabla estructurada con las siguientes columnas: Fase de la Clase, Duración, Actividad, Objetivo de Aprendizaje (Taxonomía de Bloom), Recursos Necesarios, Criterios de Éxito/Evaluación.`, category: Category.Educacion, author: 'Equipo GeniusPrompt', createdAt: '2024-07-02T10:00:00Z', rating: 5.0, downloads: 420, isPublished: true },
    { id: 'new-prompt-4', title: 'Retroalimentación Crítica para Propuesta de Investigación', description: 'Evalúa y ofrece retroalimentación constructiva sobre una propuesta de investigación educativa.', content: `Actúa como un investigador con experiencia en educación superior e innovación educativa. Evalúa y ofrece retroalimentación crítica y constructiva sobre la siguiente propuesta de investigación titulada 'Impacto de los Modelos de Lenguaje Grandes (LLMs) en la Comprensión Lectora de Estudiantes Universitarios de Humanidades'.
    ◦ Objetivos de la Evaluación: Analiza la propuesta considerando los siguientes aspectos clave:
        ▪ Relevancia: ¿Es el tema actual y significativo para el campo de la educación digital?.
        ▪ Viabilidad: ¿Es el estudio metodológicamente factible (ej. acceso a población, recursos)?.
        ▪ Potencial Impacto: ¿Qué contribución podría hacer a la pedagogía o al uso ético de la IA en la educación?.
        ▪ Consideraciones Éticas: ¿Se abordan adecuadamente la transparencia, la protección de datos y la autonomía del usuario en el diseño del estudio?.
    ◦ Instrucciones de Respuesta:
        ▪ Inicia con un análisis crítico general de la propuesta.
        ▪ Luego, para cada uno de los cuatro objetivos de evaluación anteriores (Relevancia, Viabilidad, Potencial Impacto, Consideraciones Éticas), presenta un análisis detallado en formato de lista con viñetas, incluyendo fortalezas, debilidades y áreas de mejora.
        ▪ Finaliza con cinco sugerencias concretas para mejorar la propuesta, enfocadas en rigor metodológico y alineación con principios éticos.
    ◦ Considera: Si la propuesta no proporciona detalles suficientes en algún punto, genera preguntas de clarificación que el proponente debería responder para una evaluación más completa.`, category: Category.Educacion, author: 'Equipo GeniusPrompt', createdAt: '2024-07-02T11:00:00Z', rating: 4.9, downloads: 350, isPublished: true },
    // Social Media
    { id: 'new-prompt-5', title: 'Plan de Contenido Mensual para Coaching Financiero', description: 'Crea un plan de contenido de Instagram para un servicio de coaching financiero personal.', content: `Eres un Especialista en Contenido de Redes Sociales con un profundo conocimiento de estrategias de engagement para plataformas de crecimiento rápido. Necesito que crees un plan de contenido de Instagram para un servicio de coaching financiero personal durante el próximo mes.
    ◦ Contexto: Nuestro público objetivo son profesionales jóvenes (25-35 años) con ingresos crecientes que buscan optimizar sus finanzas personales, invertir y planificar su futuro.
    ◦ Acción: Genera un calendario editorial semanal que incluya:
        ▪ Días y horas de publicación recomendadas para maximizar el alcance.
        ▪ Tipo de contenido para cada día (ej. carrusel, reel, historia, infografía, post de pregunta-respuesta).
        ▪ Temas específicos que aborden desafíos financieros comunes (ej. "cómo ahorrar para la primera vivienda", "invertir en fondos indexados para principiantes").
        ▪ Un ejemplo de copy persuasivo para al menos dos publicaciones semanales, utilizando sesgos cognitivos como la prueba social o la escasez, y un CTA claro.
    ◦ Formato: Presenta la respuesta como una tabla organizada por semanas y días, con columnas para Día, Hora, Tipo de Contenido, Tema/Título, y Ejemplo de Copy/Notas.
    ◦ Tono: El tono debe ser informativo, empático, motivador y profesional, pero también accesible y moderno para atraer a una audiencia joven.`, category: Category.SocialMedia, author: 'Equipo GeniusPrompt', createdAt: '2024-07-03T10:00:00Z', rating: 4.8, downloads: 280, isPublished: true },
    { id: 'new-prompt-6', title: 'Borradores de Tweets para Lanzamiento de Smartphone', description: 'Crea cinco tweets convincentes para el anuncio de un nuevo smartphone plegable.', content: `Actúa como un experto en marketing de lanzamientos de productos tecnológicos. Crea cinco borradores de tweets convincentes para el anuncio de un nuevo smartphone plegable con tecnología de batería de grafeno.
    ◦ Objetivo: Generar expectación y destacar las características únicas del producto: duración extrema de la batería y diseño innovador.
    ◦ Audiencia: Usuarios de tecnología, entusiastas de los smartphones, y personas que valoran la innovación y la sostenibilidad (por la mayor eficiencia energética del grafeno).
    ◦ Acción:
        ▪ Cada tweet debe ser conciso y de alto impacto, ideal para plataformas como Twitter.
        ▪ Utiliza hashtags relevantes y emojis estratégicos.
        ▪ Un tweet debe ser multilingüe, replicando el anuncio en los 10 idiomas más hablados del mundo (menciona los idiomas y luego el tweet).
        ▪ Incluye un llamado a la acción (CTA) claro en cada tweet, por ejemplo, para visitar la página del producto o pre-ordenar.
        ▪ Considera: uno de los tweets debe aplicar el sesgo de singularidad explicando qué hace único al producto.`, category: Category.SocialMedia, author: 'Equipo GeniusPrompt', createdAt: '2024-07-03T11:00:00Z', rating: 4.7, downloads: 400, isPublished: true },
    // Escritura
    { id: 'new-prompt-7', title: 'Análisis de Impacto de la Computación Cuántica', description: 'Prepara un análisis profundo sobre el impacto de la computación cuántica en la ciberseguridad.', content: `Eres un analista de investigación senior en un think tank global, y tu tarea es preparar un análisis profundo y bien estructurado sobre el 'Impacto de la Computación Cuántica en la Ciberseguridad Global para 2035'.
    ◦ Propósito: Este informe será utilizado por líderes de gobiernos y corporaciones multinacionales para la toma de decisiones estratégicas.
    ◦ Puntos clave a abordar:
        ▪ Estado actual: Breve panorama de la ciberseguridad y la computación cuántica.
        ▪ Amenazas: Cómo la computación cuántica podría romper los métodos de cifrado actuales (ej. RSA, ECC).
        ▪ Oportunidades: Nuevas soluciones de ciberseguridad basadas en la cuántica (ej. criptografía post-cuántica, QKD).
        ▪ Implicaciones geopolíticas y económicas: Impacto en la seguridad nacional y la economía digital.
        ▪ Recomendaciones estratégicas: Pasos concretos que gobiernos y empresas deben tomar ahora.
    ◦ Formato de la respuesta: Un informe técnico con apartados bien definidos, subtítulos claros, e incluye referencias a estudios recientes y datos actualizados (simulados si no hay fuentes reales en tu base de conocimiento, pero indica que son simulados). Utiliza etiquetas XML como <section title="Título de la Sección">Contenido</section> para estructurar cada apartado.
    ◦ Longitud: El informe debe tener una extensión de aproximadamente 1000-1500 palabras, equilibrando la profundidad con la concisión para una audiencia ejecutiva.
    ◦ Tono: Profesional, analítico y anticipatorio.`, category: Category.Escritura, author: 'Equipo GeniusPrompt', createdAt: '2024-07-04T10:00:00Z', rating: 4.9, downloads: 320, isPublished: true },
    { id: 'new-prompt-8', title: 'Corrector de Estilo y Editor Profesional', description: 'Refina y mejora un texto preservando el significado y estilo original del autor.', content: `Como corrector de estilo y editor profesional con un ojo agudo para el detalle y una profunda comprensión del lenguaje, el estilo y la gramática. Tu tarea es refinar y mejorar el siguiente texto [insertar texto aquí], asegurándote de que:
    ◦ Gramática y Vocabulario: Se corrijan todos los errores ortográficos, de puntuación, problemas con los tiempos verbales y problemas de elección de palabras.
    ◦ Claridad y Concisión: Se eliminen ambigüedades y se mejore la fluidez de las oraciones para una comprensión más fácil.
    ◦ Preservación del Significado y Estilo Original: No debes cambiar el estilo de escritura ni la intención original del autor. Si el texto es informal, debe seguir siéndolo; si es técnico, debe mantener su tecnicidad.
    ◦ Formato: Presenta el texto revisado y, en un apartado separado, una lista de las 5-7 mejoras más significativas realizadas, explicando brevemente el porqué de cada cambio.
    ◦ Reflexión (Chain-of-Thought): Antes de la respuesta final, realiza un proceso de pensamiento interno donde evalúes los puntos a mejorar y cómo los abordarás, utilizando un bloque <thinking> (este pensamiento no debe aparecer en la salida final).`, category: Category.Escritura, author: 'Equipo GeniusPrompt', createdAt: '2024-07-04T11:00:00Z', rating: 4.8, downloads: 290, isPublished: true },
    // Creatividad
    { id: 'new-prompt-9', title: 'Generador de Ideas de Productos Disruptivos', description: 'Genera 5 ideas disruptivas para una nueva línea de productos de alimentación saludable y sostenible.', content: `Actúa como un innovador de productos y estratega creativo. Genera cinco ideas disruptivas para una nueva línea de productos en el sector de 'alimentación saludable y sostenible'.
    ◦ Objetivo: Los productos deben ser innovadores, sostenibles y atractivos para un público preocupado por la salud y el medio ambiente.
    ◦ Para cada idea, incluye:
        ▪ Nombre del Producto: Un nombre pegadizo y memorable.
        ▪ Concepto: Descripción breve del producto y su propuesta de valor única.
        ▪ Puntos de Venta Únicos (USPs): Qué lo hace diferente de la competencia.
        ▪ Componente Sostenible: Cómo el producto contribuye a la sostenibilidad (ej. ingredientes, empaque, cadena de suministro).
        ▪ Público Objetivo: Demografía e intereses principales.
        ▪ Potenciales Casos de Uso/Consumo: Cómo y cuándo se utilizaría el producto.
    ◦ Formato: Presenta cada idea en una sección separada con un título claro, y utiliza viñetas para los detalles.
    ◦ Consejo adicional: Para lograr la máxima creatividad, puedes combinar la técnica de 'Generación Continua de Ideas' (pidiendo que continúe hasta que se le diga 'suficiente') con el formato estructurado.`, category: Category.Creatividad, author: 'Equipo GeniusPrompt', createdAt: '2024-07-05T10:00:00Z', rating: 4.9, downloads: 260, isPublished: true },
    { id: 'new-prompt-10', title: 'Escritor de Historias Cortas con Giro Inesperado', description: 'Escribe una historia corta de 300 palabras con elementos predefinidos y un giro argumental.', content: `Eres un escritor de ciencia ficción y fantasía galardonado con la capacidad de crear mundos inmersivos y personajes complejos. Escribe una historia corta de unas 300 palabras que incluya los siguientes elementos:
    ◦ Personaje Principal: Un anciano ermitaño que vive en una montaña remota, con un pasado misterioso.
    ◦ Elemento Mágico/Tecnológico: Un cristal pulsante que altera el tiempo y el espacio a su alrededor.
    ◦ Conflicto Central: Una joven viajera que busca al ermitaño para pedirle ayuda con una catástrofe inminente que afecta a su aldea.
    ◦ Giro Inesperado: El cristal es la fuente de la catástrofe, no la solución, y el ermitaño lo sabe.
    ◦ Tono: La historia debe tener un tono melancólico y misterioso al principio, transformándose en urgente y dramático hacia el final.
    ◦ Formato: Proporciona la historia en un solo bloque de texto coherente.
    ◦ Reflexión: Después de la historia, haz una breve reflexión sobre cómo los elementos se entrelazan para crear la atmósfera deseada y el impacto del giro.`, category: Category.Creatividad, author: 'Equipo GeniusPrompt', createdAt: '2024-07-05T11:00:00Z', rating: 4.8, downloads: 220, isPublished: true },
    // AnalisisDeDatos
    { id: 'new-prompt-11', title: 'Analizador de Logs de Errores a JSON', description: 'Analiza un log de errores de sistema no estructurado y lo convierte en una tabla JSON personalizada.', content: `Actúa como un analista de datos altamente experimentado con un profundo conocimiento en el procesamiento de lenguaje natural (NLP) y la extracción de información. Tu tarea es analizar el siguiente texto no estructurado (proporcionado por el usuario, un log de errores de sistema) y convertirlo en una tabla JSON personalizada.
    ◦ Texto a analizar: [Insertar aquí un ejemplo de log de errores con fechas, tipos de error, módulos afectados, mensajes de error y IDs de usuario (anonimizados)]
    ◦ Instrucciones:
        1. Extrae las siguientes categorías de información para cada entrada del log: timestamp (fecha y hora), error_type (tipo de error), module (módulo afectado), error_message (mensaje de error) y user_id (ID de usuario).
        2. Asegúrate de que el formato JSON sea válido y que cada entrada del log se convierta en un objeto JSON separado dentro de un array.
        3. Manejo de Ambigüedad: Si alguna información es ambigua o falta, indícalo claramente con un valor null o N/A.
        4. Consideración ética: Asegúrate de que no se incluya ninguna información de identificación personal (IIP) sensible si la encuentras en el log, cámbiala por 'XXX' o 'ANONYMIZED_ID'.
    ◦ Formato de Salida:
    ◦ Reflexión: Al final, proporciona una breve explicación de los desafíos encontrados al procesar el texto no estructurado y cómo se abordaron.`, category: Category.AnalisisDeDatos, author: 'Equipo GeniusPrompt', createdAt: '2024-07-06T10:00:00Z', rating: 4.9, downloads: 380, isPublished: true },
    { id: 'new-prompt-12', title: 'Análisis de Tendencias de Mercado (VE)', description: 'Realiza un análisis de tendencias y proyecciones sobre la adopción de vehículos eléctricos.', content: `Eres un consultor estratégico especializado en análisis de mercado. Necesito un análisis de tendencias y proyecciones sobre la adopción de vehículos eléctricos (VE) a nivel global para los próximos cinco años (2025-2030), basado en los datos que te proporciono a continuación y en tu conocimiento general.
    ◦ Datos proporcionados (ejemplo):
        ▪ "2023: 14% de cuota de mercado global de VE, con China liderando (60% de ventas globales)."
        ▪ "2024: Proyección de 18% de cuota de mercado, impulso por políticas de incentivo en Europa."
        ▪ "Costo de baterías ha disminuido un 15% anual en los últimos 3 años."
        ▪ "Desafíos: Infraestructura de carga insuficiente en algunas regiones, ansiedad por la autonomía."
        ▪ "Innovaciones: Avances en baterías de estado sólido, mejoras en software de gestión de energía."
    ◦ Acciones a realizar:
        1. Resume los datos clave y las tendencias actuales en la adopción de VE.
        2. Proyecta la cuota de mercado global de VE para 2030, justificando tu estimación con los datos y las tendencias.
        3. Identifica los 3-5 factores clave (impulsores y desafíos) que influirán en esta adopción.
        4. Sugiere dos estrategias para acelerar la adopción de VE, una enfocada en infraestructura y otra en educación del consumidor.
    ◦ Formato: Un informe conciso con encabezados y viñetas, incluyendo una sección de 'Conclusiones Clave y Proyecciones' y una 'Lista de Datos Clave Utilizados' al final para verificación.
    ◦ Tono: Analítico, objetivo y con visión de futuro.`, category: Category.AnalisisDeDatos, author: 'Equipo GeniusPrompt', createdAt: '2024-07-06T11:00:00Z', rating: 4.8, downloads: 340, isPublished: true },
    // Codificacion
    { id: 'new-prompt-13', title: 'Función Python para Conexión a Base de Datos', description: 'Crea una función Python que se conecte a PostgreSQL y obtenha datos de un usuario con manejo de errores.', content: `Actúa como un Ingeniero de Software Senior especializado en Python y bases de datos relacionales. Tu tarea es crear una función Python que se conecte a una base de datos PostgreSQL y obtenga datos de un usuario específico.
    ◦ Especificaciones de la función:
        ▪ Nombre: get_user_data
        ▪ Parámetros de Entrada: username (string), db_config (diccionario con credenciales y detalles de conexión: host, database, user, password).
        ▪ Funcionalidad: Debe conectar con la base de datos, ejecutar una consulta SQL para seleccionar todos los datos del usuario con el username proporcionado, y devolver los resultados como un diccionario.
        ▪ Manejo de Errores: Incluye bloques try-except para manejar posibles errores de conexión a la base de datos, errores SQL (ej. usuario no encontrado) y otros errores inesperados, registrando los errores en un archivo de log.
        ▪ Pruebas (Chain-of-Thought): Antes de la función final, piensa paso a paso en cómo abordarías la conexión, la consulta y el manejo de errores. Luego, genera tres casos de prueba (test_case_1, test_case_2, test_case_3) que validen la función (ej. usuario existente, usuario no existente, credenciales incorrectas) y demuestra la ejecución de estos test cases dentro de un bloque de pensamiento extendido, verificando la salida esperada.
    ◦ Formato: Proporciona el código Python completo y comentado, seguido de la explicación del razonamiento de los test cases y sus resultados.`, category: Category.Codificacion, author: 'Equipo GeniusPrompt', createdAt: '2024-07-07T10:00:00Z', rating: 5.0, downloads: 550, isPublished: true },
    { id: 'new-prompt-14', title: 'Optimizador y Refactorizador de Código Python', description: 'Analiza y optimiza un fragmento de código Python para mejorar su rendimiento y eficiencia.', content: `Eres un Arquitecto de Software y un Ingeniero de Optimización de Código. Analiza el siguiente fragmento de código Python y sugiere mejoras para optimizar su rendimiento, especialmente en términos de eficiencia y consumo de recursos.
    ◦ Fragmento de Código a Optimizar:
    ◦ Acciones a realizar:
        1. Identifica las áreas donde el código puede hacerse más eficiente o rápido.
        2. Proporciona sugerencias específicas para la optimización, junto con explicaciones claras de por qué estas mejoras optimizarán el rendimiento (ej. uso de list comprehensions, map, generators para evitar construir listas intermedias si no es necesario).
        3. Refactoriza el código original para incorporar las mejoras sugeridas, mostrando la versión optimizada.
        4. Evalúa la complejidad temporal (Big O notation) del código original y del código optimizado, explicando tu razonamiento paso a paso.
    ◦ Formato: Presenta primero un análisis detallado en viñetas sobre los problemas del código original, luego el código refactorizado, y finalmente la comparación de complejidades temporales.`, category: Category.Codificacion, author: 'Equipo GeniusPrompt', createdAt: '2024-07-07T11:00:00Z', rating: 4.9, downloads: 480, isPublished: true },
    // Negocios
    { id: 'new-prompt-15', title: 'Plan de Negocio para Startup de IA en Salud', description: 'Desarrolla un plan de negocio innovador para una plataforma SaaS de IA que optimiza la gestión de historiales clínicos.', content: `Actúa como un Consultor Estratégico de Negocios con una vasta experiencia en planificación y lanzamiento de startups exitosas. Desarrolla un plan de negocio innovador para una startup ficticia llamada 'MediFlow AI'.
    ◦ Concepto de Negocio: 'MediFlow AI' es una plataforma SaaS basada en IA que optimiza la gestión de historiales clínicos y la asignación de recursos en hospitales pequeños y clínicas rurales, utilizando procesamiento de lenguaje natural para resumir notas de médicos y algoritmos de optimización para horarios de personal.
    ◦ Componentes del Plan de Negocio:
        1. Resumen Ejecutivo: Visión, misión, y propuesta de valor única.
        2. Análisis de Mercado: Identificación del público objetivo, tamaño del mercado, y análisis de la competencia.
        3. Modelo de Negocio: Cómo generará ingresos (ej. suscripción, freemium, per-use).
        4. Estrategia de Marketing y Ventas: Cómo llegar a los clientes (ej. marketing digital, alianzas con asociaciones médicas).
        5. Proyecciones Financieras Clave (simuladas): Estimaciones de ingresos y gastos para los primeros 3 años.
        6. Análisis de Riesgos: Identificación de posibles riesgos (ej. privacidad de datos, adopción tecnológica, competencia) y estrategias de mitigación.
    ◦ Formato: Estructura la respuesta como un informe ejecutivo con secciones claras y subtítulos, utilizando viñetas y negritas para resaltar los puntos clave.
    ◦ Tono: Profesional, analítico y convincente.`, category: Category.Negocios, author: 'Equipo GeniusPrompt', createdAt: '2024-07-08T10:00:00Z', rating: 4.9, downloads: 270, isPublished: true },
    { id: 'new-prompt-16', title: 'Plan de Implementación de Metodología Scrum', description: 'Crea un plan detallado para introducir Scrum en un equipo de desarrollo de videojuegos.', content: `Eres un especialista en metodologías ágiles (Scrum Master/Agile Coach) con experiencia en la implementación exitosa de marcos ágiles en grandes organizaciones. Crea un plan de implementación detallado para introducir la metodología Scrum en el equipo de desarrollo de software de una empresa de desarrollo de videojuegos.
    ◦ Contexto: El equipo consta de 20 desarrolladores, 5 artistas y 3 diseñadores de juegos. Han estado trabajando con un modelo de cascada tradicional y experimentan retrasos constantes, falta de comunicación interdepartamental y baja moral. El objetivo es mejorar la eficiencia, la colaboración y la capacidad de respuesta a los cambios del mercado.
    ◦ Acciones a realizar:
        1. Fases de Implementación: Divide el proceso en fases claras (ej. Kick-off, Formación, Primer Sprint, Optimización).
        2. Actividades Clave por Fase: Detalla las actividades específicas para cada fase, incluyendo roles y responsabilidades.
        3. Métricas de Éxito: Define al menos 3-5 métricas para evaluar el éxito de la implementación (ej. tiempo de entrega, satisfacción del equipo, número de bugs en producción).
        4. Desafíos Anticipados y Soluciones: Identifica posibles resistencias o problemas durante la transición y propone soluciones para superarlos.
        5. Herramientas Sugeridas: Recomienda herramientas para la gestión de proyectos ágiles (ej. Jira, Trello).
    ◦ Formato: Presenta el plan como un documento estructurado con secciones y viñetas, utilizando un tono práctico y facilitador.
    ◦ Consejo: Considera aplicar la técnica de 'Desarrollo de Planes de Acción' para detallar los pasos intermedios.`, category: Category.Negocios, author: 'Equipo GeniusPrompt', createdAt: '2024-07-08T11:00:00Z', rating: 4.8, downloads: 230, isPublished: true },
    // Tecnología
    { id: 'new-prompt-17', title: 'Explicación de Computación Sin Servidor (Serverless)', description: 'Explica el concepto de Serverless a un público de empresarios no técnicos.', content: `Actúa como un ingeniero de sistemas y evangelista de tecnología con la habilidad de simplificar conceptos complejos. Tu tarea es explicar el concepto de 'Computación Sin Servidor (Serverless Computing)' a un público de pequeños y medianos empresarios (PYMES) no técnicos.
    ◦ Objetivo: El objetivo es que los empresarios comprendan los beneficios de esta tecnología para sus negocios sin ahondar en jerga técnica excesiva.
    ◦ Puntos clave a explicar:
        ▪ ¿Qué es la computación sin servidor? (Explicación básica y analogía sencilla).
        ▪ Ventajas para PYMES: Costo-efectividad, escalabilidad, reducción de la carga operativa.
        ▪ Casos de Uso Comunes: Ejemplos prácticos para PYMES (ej. procesamiento de eventos, APIs, chatbots).
        ▪ Limitaciones (simplificadas): Cuándo podría no ser la mejor opción.
    ◦ Formato: Un artículo corto (aprox. 400-500 palabras) estructurado con introducción, secciones claras y una conclusión, utilizando un lenguaje sencillo, analogías y ejemplos concretos.
    ◦ Tono: Educativo, informativo y accesible.`, category: Category.Tecnologia, author: 'Equipo GeniusPrompt', createdAt: '2024-07-09T10:00:00Z', rating: 4.9, downloads: 300, isPublished: true },
    { id: 'new-prompt-18', title: 'Diseño de Arquitectura en AWS para E-learning', description: 'Diseña una arquitectura de alto nivel en AWS para una plataforma de e-learning escalable.', content: `Eres un arquitecto de soluciones en la nube especializado en AWS. Diseña una arquitectura de sistema de alto nivel para una nueva plataforma de e-learning escalable y segura.
    ◦ Requisitos del Sistema:
        ▪ Usuarios: Soporte para millones de usuarios concurrentes.
        ▪ Contenido: Almacenamiento y transmisión de video de alta calidad, documentos y contenido interactivo.
        ▪ Funcionalidades: Registro de usuarios, gestión de cursos, seguimiento del progreso, foros de discusión, sistema de exámenes y pasarela de pagos.
        ▪ Seguridad: Alta protección de datos sensibles de usuarios y pagos.
        ▪ Escalabilidad: Capacidad de escalar automáticamente según la demanda.
        ▪ Costo-efectividad: Optimización de costes de infraestructura.
    ◦ Acciones a realizar:
        1. Identifica los componentes principales de la arquitectura utilizando servicios clave de AWS (ej. S3, EC2, Lambda, RDS, DynamoDB, CloudFront, Cognito, WAF, etc.).
        2. Explica la función de cada componente en el contexto de la plataforma de e-learning.
        3. Detalla cómo se logrará la escalabilidad, seguridad y costo-efectividad con estos componentes.
        4. Proporciona un diagrama conceptual simplificado de la arquitectura (descrito textualmente con componentes y flujos de datos principales).
    ◦ Formato: Un documento técnico con encabezados, viñetas y descripciones claras. El diagrama debe ser una descripción textual que represente los bloques y conexiones.`, category: Category.Tecnologia, author: 'Equipo GeniusPrompt', createdAt: '2024-07-09T11:00:00Z', rating: 5.0, downloads: 450, isPublished: true },
    // Salud y Bienestar
    { id: 'new-prompt-19', title: 'Diseño de Simulación Médica de Alta Fidelidad', description: 'Diseña un escenario de simulación para el manejo de un paciente con trauma torácico.', content: `Actúa como un consultor en educación médica y coordinador de simulaciones de emergencia. Diseña un escenario de simulación de alta fidelidad para la clase de 'Medicina de Urgencias' sobre el tema 'Manejo Inicial de un Paciente con Trauma Torácico por Accidente de Tráfico'.
    ◦ Objetivos de Aprendizaje:
        ▪ Evaluar la escena y la seguridad.
        ▪ Realizar una evaluación primaria (ABCDE).
        ▪ Identificar signos de neumotórax a tensión o hemotórax masivo.
        ▪ Aplicar intervenciones críticas (ej. descompresión con aguja, inserción de tubo torácico).
        ▪ Comunicación efectiva con el equipo multidisciplinario.
    ◦ Componentes del Escenario:
        1. Contexto del Paciente: Edad, sexo, mecanismo de la lesión, signos vitales iniciales, breve historial.
        2. Configuración del Escenario: Descripción del entorno (ambulancia, sala de emergencias), equipos disponibles (material de vía aérea, monitores, toracostomía).
        3. Roles para Estudiantes: Roles que los estudiantes deben asumir (líder de equipo, enfermero, apoyo).
        4. Progresión del Caso: Cómo evolucionará el paciente si las intervenciones son correctas/incorrectas.
        5. Puntos Críticos de Decisión: Momentos clave donde los estudiantes deben tomar decisiones.
        6. Criterios de Evaluación: Rúbrica de observación para evaluar el desempeño (ej. liderazgo, comunicación, habilidades técnicas).
    ◦ Formato: Un documento detallado con secciones claras, incluyendo una introducción al escenario, la progresión del caso paso a paso y la rúbrica de evaluación.`, category: Category.SaludYBienestar, author: 'Equipo GeniusPrompt', createdAt: '2024-07-10T10:00:00Z', rating: 4.9, downloads: 210, isPublished: true },
    { id: 'new-prompt-20', title: 'Guion de Meditación Guiada para Reducción de Estrés', description: 'Crea un guion de meditación guiada de 10 minutos para profesionales de alta presión.', content: `Eres un experto en mindfulness y manejo del estrés con un enfoque en técnicas basadas en evidencia. Tu tarea es crear un guion de meditación guiada de 10 minutos para ayudar a profesionales de alta presión (ej. ejecutivos, personal sanitario) a reducir el estrés y mejorar la claridad mental.
    ◦ Objetivo: Proporcionar una herramienta práctica y accesible para la reducción del estrés en un entorno de trabajo exigente.
    ◦ Elementos del Guion:
        ▪ Introducción: Establecer el propósito y guiar al oyente a una postura cómoda.
        ▪ Conciencia Corporal: Escaneo corporal o anclaje en la respiración.
        ▪ Atención al Sonido/Entorno: Ampliar la conciencia al entorno.
        ▪ Atención a Pensamientos y Emociones: Observación sin juicio.
        ▪ Visualización (opcional): Una visualización breve y tranquilizadora (ej. un lugar seguro).
        ▪ Cierre: Regreso suave a la conciencia del entorno y un mensaje final de bienestar.
    ◦ Tono: La voz debe ser cálida, calmada, empática y clara, con pausas indicadas para permitir la práctica.
    ◦ Formato: Presenta el guion con instrucciones detalladas y sugerencias de tono/pausas entre paréntesis para un facilitador.
    ◦ Consideraciones: La meditación debe ser adaptable para realizarse en una silla de oficina si es necesario.`, category: Category.SaludYBienestar, author: 'Equipo GeniusPrompt', createdAt: '2024-07-10T11:00:00Z', rating: 4.8, downloads: 300, isPublished: true },
    // Finanzas
    { id: 'new-prompt-21', title: 'Análisis Financiero de Empresa Ficticia', description: 'Realiza un análisis financiero basado en estados financieros simulados y calcula indicadores clave.', content: `Actúa como un analista financiero senior en una firma de inversión. Realiza un análisis del desempeño financiero de una empresa ficticia, 'TechSolutions Inc.', basándote en los siguientes estados financieros simulados del último año fiscal.
    ◦ Balance General (al 31 de diciembre de 2024):
        ▪ Activos Corrientes: $500M (Efectivo: $100M, Cuentas por Cobrar: $200M, Inventario: $200M)
        ▪ Activos No Corrientes: $1,000M (Propiedad, Planta y Equipo: $800M, Intangibles: $200M)
        ▪ Pasivos Corrientes: $300M (Cuentas por Pagar: $150M, Deuda a Corto Plazo: $150M)
        ▪ Pasivos No Corrientes: $400M (Deuda a Largo Plazo: $400M)
        ▪ Patrimonio Neto: $800M
    ◦ Estado de Resultados (Año fiscal 2024):
        ▪ Ingresos por Ventas: $1,200M
        ▪ Costo de Ventas: $600M
        ▪ Gastos Operativos: $300M
        ▪ Gastos Financieros: $50M
        ▪ Impuestos: $50M
    ◦ Acciones a realizar:
        1. Calcula y analiza los siguientes indicadores financieros clave: Margen Bruto, Margen Neto, Endeudamiento Total (Pasivos/Activos), Rotación de Inventario (Costo de Ventas/Inventario).
        2. Interpreta el balance general y el estado de resultados, identificando fortalezas y debilidades financieras.
        3. Proporciona una conclusión sobre la salud financiera de 'TechSolutions Inc.' y dos recomendaciones estratégicas (ej. para mejorar la liquidez, reducir el endeudamiento).
    ◦ Formato: Un informe estructurado con secciones para cada indicador, su cálculo y análisis, y una sección final para conclusiones y recomendaciones. Utiliza tablas o listas para los resultados.
    ◦ Reflexión: Incluye una lista de los 3-5 indicadores financieros clave utilizados para este resumen.`, category: Category.Finanzas, author: 'Equipo GeniusPrompt', createdAt: '2024-07-11T10:00:00Z', rating: 4.9, downloads: 290, isPublished: true },
    { id: 'new-prompt-22', title: 'Explicación Sencilla de Opciones Financieras', description: 'Explica qué son las opciones financieras (Call y Put) a un principiante usando analogías.', content: `Eres un educador financiero experimentado con la habilidad de simplificar conceptos complejos para principiantes. Explica el concepto de 'Opciones Financieras' a una persona sin conocimientos previos de mercados financieros.
    ◦ Objetivo: Que el usuario entienda qué son las opciones, por qué alguien las usaría (cobertura o especulación) y los dos tipos básicos (call y put).
    ◦ Acciones a realizar:
        1. Define qué es una opción financiera usando una analogía sencilla y cotidiana (ej. comprar un 'derecho' a algo en el futuro sin la 'obligación').
        2. Explica la diferencia entre una opción 'Call' y una opción 'Put' con ejemplos claros.
        3. Describe brevemente las dos razones principales por las que alguien podría usar opciones: cobertura (hedging) y especulación.
        4. Simplifica al máximo la terminología, evitando jerga innecesaria.
    ◦ Formato: Una explicación narrativa fluida y didáctica, con subtítulos para organizar los conceptos clave.
    ◦ Tono: Amigable, paciente y claro.`, category: Category.Finanzas, author: 'Equipo GeniusPrompt', createdAt: '2024-07-11T11:00:00Z', rating: 4.8, downloads: 240, isPublished: true },
    // Viajes
    { id: 'new-prompt-23', title: 'Itinerario Personalizado de 7 Días por Andalucía', description: 'Diseña un itinerario detallado para un viaje a Andalucía (España) para una pareja.', content: `Actúa como un planificador de viajes personalizado y experto local con un profundo conocimiento de la región de Andalucía, España. Diseña un itinerario detallado de 7 días para una pareja que busca una mezcla de cultura, gastronomía y relajación, con un presupuesto medio.
    ◦ Objetivo: Proporcionar una experiencia de viaje equilibrada y memorable.
    ◦ Día por día, incluye:
        ▪ Ciudad/Localidad: Donde se alojarán o visitarán cada día.
        ▪ Actividades Principales: (2-3 por día) Visitas culturales (ej. monumentos, museos), experiencias gastronómicas (ej. tapeo, clases de cocina), momentos de relajación (ej. playa, parques).
        ▪ Sugerencias de Alojamiento: Tipo de alojamiento (ej. hotel boutique, casa rural, hostal con encanto), sin nombres específicos, solo el estilo.
        ▪ Sugerencias Gastronómicas: Platos locales a probar, tipos de restaurantes.
        ▪ Notas/Consejos: Información práctica (ej. reservas, transporte, mejor hora para visitar).
    ◦ Formato: Un itinerario diario claro con encabezados para cada día, utilizando viñetas para las actividades y sugerencias.
    ◦ Tono: Entusiasta, informativo y útil.`, category: Category.Viajes, author: 'Equipo GeniusPrompt', createdAt: '2024-07-12T10:00:00Z', rating: 4.9, downloads: 330, isPublished: true },
    { id: 'new-prompt-24', title: 'Experiencias de Viaje Sostenibles en Patagonia', description: 'Sugiere 5 opciones de experiencias de viaje sostenibles y éticas para la Patagonia.', content: `Eres un consultor de viajes sostenibles y un defensor del turismo responsable. Sugiere cinco opciones de experiencias de viaje sostenibles y éticas para la región de Patagonia (Argentina/Chile).
    ◦ Objetivo: Minimizar el impacto ambiental, apoyar a las comunidades locales y promover la conservación.
    ◦ Para cada opción de experiencia, incluye:
        ▪ Nombre de la Experiencia: Un nombre atractivo y descriptivo.
        ▪ Descripción: En qué consiste la experiencia y por qué es sostenible.
        ▪ Impacto Positivo: Cómo beneficia al medio ambiente o a la comunidad local (ej. ecoturismo, apoyo a artesanos, conservación de la fauna).
        ▪ Actividades Sugeridas: Acciones específicas que el viajero realizaría.
        ▪ Tipo de Viajero: A quién va dirigida (ej. aventureros, amantes de la naturaleza, familias).
    ◦ Formato: Presenta cada opción en una sección separada con un título, utilizando viñetas para los detalles clave.
    ◦ Tono: Inspirador, educativo y consciente.`, category: Category.Viajes, author: 'Equipo GeniusPrompt', createdAt: '2024-07-12T11:00:00Z', rating: 4.8, downloads: 280, isPublished: true },
    // Arte y Diseño
    { id: 'new-prompt-25', title: 'Brief de Diseño para Identidad de Marca de Cafetería', description: 'Diseña un brief de diseño completo para la identidad de marca de una cafetería artesanal.', content: `Actúa como un experto en diseño gráfico y branding con un profundo conocimiento de psicología del color y composición. Diseña un brief de diseño completo para la identidad de marca de una cafetería artesanal ficticia llamada 'Alma Cafeto'.
    ◦ Concepto de Negocio: 'Alma Cafeto' es una cafetería que se enfoca en granos de café de origen único, tueste artesanal y un ambiente acogedor que fomenta la creatividad y la comunidad.
    ◦ Elementos del Brief de Diseño:
        1. Visión y Misión de la Marca: Qué representa 'Alma Cafeto'.
        2. Público Objetivo: Demografía e intereses principales.
        3. Personalidad de la Marca: (ej. acogedora, auténtica, creativa, premium, sostenible).
        4. Palabras Clave de Diseño: (3-5 adjetivos que describan la estética deseada).
        5. Paleta de Colores Sugerida: Nombres de colores (ej. "Tierra Quemada," "Verde Bosque") y su justificación psicológica en relación con el café y la sostenibilidad.
        6. Tipografía Sugerida: Tipos de fuente (ej. serif, sans-serif, manuscrita) y por qué se ajustan a la marca.
        7. Elementos Visuales Clave: Ideas para el logotipo (ej. un grano de café estilizado, hojas de cafeto), ilustraciones o patrones.
        8. Tono de Voz de la Marca: Cómo debería sonar la comunicación escrita.
    ◦ Formato: Un documento estructurado con secciones y viñetas, utilizando un tono creativo y profesional.
    ◦ Puntos clave: El brief debe reflejar una conexión emocional con el público objetivo e inspirar un estilo de vida relajado y auténtico.`, category: Category.ArteYDiseno, author: 'Equipo GeniusPrompt', createdAt: '2024-07-13T10:00:00Z', rating: 5.0, downloads: 310, isPublished: true },
    { id: 'new-prompt-26', title: 'Rúbrica para Evaluación de Proyecto de Moda Sostenible', description: 'Diseña una rúbrica detallada para evaluar una colección de moda cápsula sostenible.', content: `Eres un evaluador de proyectos de diseño de moda experimentado con un profundo conocimiento de tendencias, técnicas de confección y viabilidad comercial. Diseña una rúbrica detallada para la evaluación de un proyecto de diseño de moda que consiste en una 'Colección Cápsula Sostenible para el Verano 2025'.
    ◦ Objetivos de Evaluación: Asegurar que la colección no solo sea estéticamente atractiva, sino también innovadora en sostenibilidad y viable comercialmente.
    ◦ Criterios de Evaluación (con niveles de desempeño: Sobresaliente, Notable, Aceptable, Insuficiente):
        1. Creatividad e Innovación: Originalidad del concepto, uso de siluetas, texturas y colores.
        2. Sostenibilidad: Selección de materiales (ej. reciclados, orgánicos, biodegradables), procesos de producción éticos, circularidad del diseño.
        3. Técnica y Confección: Calidad de la construcción, acabado, ajuste de las prendas.
        4. Cohesión de la Colección: Unidad temática y estética entre todas las piezas.
        5. Viabilidad Comercial y Mercado: Potencial de venta, adaptación al público objetivo, estrategia de precios.
        6. Presentación del Portafolio: Claridad, organización y profesionalismo del portafolio del diseñador.
    ◦ Acciones a realizar:
        ▪ Para cada criterio, describe claramente qué se espera en cada nivel de desempeño.
        ▪ Asegúrate de que la rúbrica sea integral, contemplando aspectos cognitivos, habilidades prácticas y actitudinales (ej. ética del diseño sostenible).
        ▪ La rúbrica debe proporcionar retroalimentación significativa y ser adaptable a diferentes contextos de evaluación.
    ◦ Formato: Presenta la rúbrica en una tabla clara y bien organizada, con filas para cada criterio y columnas para los niveles de desempeño y sus descripciones.`, category: Category.ArteYDiseno, author: 'Equipo GeniusPrompt', createdAt: '2024-07-13T11:00:00Z', rating: 4.9, downloads: 250, isPublished: true },
    // Investigación
    { id: 'new-prompt-27', title: 'Asistente de Revisión de Literatura Académica', description: 'Resume artículos académicos y extrae puntos clave a partir de un abstract.', content: `Actúa como un asistente de investigación académica. He pegado el abstract de un artículo científico a continuación. Tu tarea es: 1. Resumir el objetivo principal del estudio en una frase. 2. Listar los métodos clave utilizados. 3. Resumir los hallazgos más importantes. 4. Mencionar las implicaciones o futuras líneas de investigación que sugiere el artículo.\n\nAbstract:\n[Pega aquí el abstract del artículo]`, category: Category.Investigacion, author: 'Equipo GeniusPrompt', createdAt: '2024-06-15T10:00:00Z', rating: 4.9, downloads: 280, isPublished: true },
    { id: 'new-prompt-28', title: 'Formulador de Hipótesis de Investigación', description: 'Genera hipótesis comprobables (nula y alternativas) a partir de una observación.', content: `Eres un científico metodólogo. Basado en la siguiente observación: "[Observación, ej: hemos notado que los empleados que toman descansos cortos y frecuentes parecen más productivos que los que toman un solo descanso largo]". Formula tres hipótesis de investigación distintas y comprobables (una nula y dos alternativas) que podrían ser investigadas para validar esta observación.`, category: Category.Investigacion, author: 'Equipo GeniusPrompt', createdAt: '2024-06-16T11:00:00Z', rating: 4.7, downloads: 140, isPublished: true },
    // Otras
    { id: 'new-prompt-29', title: 'Diagnóstico de Modelo de Machine Learning (Multi-turn)', description: 'Diagnostica y mejora un modelo de clasificación con baja precisión en datos nuevos.', content: `Turno 1 (Usuario): "Actúa como un científico de datos con experiencia en el diagnóstico de problemas de rendimiento en algoritmos de machine learning. Tu tarea es analizar una situación donde un modelo de clasificación está teniendo baja precisión en datos nuevos (fuera del conjunto de entrenamiento) y desarrollar un plan para diagnosticar y mejorar este problema. Piensa paso a paso y desglosa el problema.
        ▪ Problema: Un modelo de clasificación binaria (ej. para detección de spam) entrenado previamente funciona bien en datos históricos, pero su rendimiento cae significativamente al aplicarlo a emails nuevos.
        ▪ Contexto: El equipo no sabe si el problema es de sesgo de datos, sobreajuste, o si los datos nuevos han cambiado fundamentalmente.
        ▪ Formato: Genera una serie de pasos numerados para el diagnóstico inicial, formulando preguntas clave que necesitarías que el equipo responda para avanzar."
    Turno 2 (IA - Simulación de respuesta inicial): "Pensemos paso a paso. Para diagnosticar la baja precisión de tu modelo en datos nuevos, primero necesitamos recopilar más información y descartar las causas comunes.
        1. Recopilación de Datos:
            • Pregunta 1: ¿El rendimiento cae repentinamente o ha sido una degradación gradual?
            • Pregunta 2: ¿Tenéis un conjunto de datos de validación independiente que simule el 'mundo real' o solo el conjunto de entrenamiento/prueba original?
            • Pregunta 3: ¿Podéis proporcionar ejemplos de los 'emails nuevos' donde el modelo falla? (especialmente falsos positivos/negativos).
        2. Análisis de Distribución de Datos:
            • Pregunta 4: ¿Hay una desviación de datos (data drift) significativa entre los datos de entrenamiento y los datos nuevos? (ej. el spam ha evolucionado, o el contenido de los emails legítimos ha cambiado).
            • Pregunta 5: ¿Las etiquetas (labels) de los nuevos datos son consistentes con las del entrenamiento?
        3. Evaluación del Modelo:
            • Pregunta 6: ¿Qué métricas de evaluación utilizáis (precisión, recall, F1-score, AUC-ROC)?
            • Pregunta 7: ¿Cuál es la precisión en el conjunto de entrenamiento y en el conjunto de prueba original? (para identificar sobreajuste) Con estas respuestas, podremos refinar el diagnóstico. Por favor, proporciona la información."
    Turno 3 (Usuario - Solicitud de Auto-Refinamiento): "Basándote en tu análisis inicial y suponiendo que el equipo te ha respondido que 'sí, hay un cambio notable en el tipo de spam, y sospechamos sobreajuste dado el alto rendimiento en el entrenamiento'. Ahora, refina tu plan de diagnóstico y propone dos posibles estrategias de mejora para el modelo. Permite que el modelo critique su solución y luego la resuelva de nuevo, incorporando la autocrítica para mejorar la respuesta."`, category: Category.Otras, author: 'Equipo GeniusPrompt', createdAt: '2024-07-14T10:00:00Z', rating: 5.0, downloads: 400, isPublished: true },
    { id: 'new-prompt-30', title: 'Fábrica de Prompts para Asistente de Contratación (Meta-Prompting)', description: 'Genera 3 prompts efectivos para un asistente de IA de contratación de personal.', content: `Eres un 'Ingeniero de Prompts Maestro' capaz de generar prompts altamente efectivos para diversas tareas y perfiles de usuario. Tu tarea es crear tres prompts diferentes para un 'Asistente de Contratación de Personal' basado en IA, que ayude a empresas de tecnología a encontrar candidatos para puestos de 'Desarrollador Full Stack Senior'.
    ◦ Principios de Generación de Prompts: Cada prompt generado debe seguir las siguientes directrices clave:
        ▪ Asignación de Rol: Cada prompt debe comenzar asignando un rol específico a la IA (ej. 'Experto en adquisición de talento', 'Evaluador técnico de currículums').
        ▪ Contexto y Objetivo Claro: Definir claramente la situación y el propósito de la interacción.
        ▪ Formato de Salida Especificado: Indicar el formato deseado para la respuesta de la IA (ej. lista, tabla, resumen estructurado).
        ▪ Detalles Específicos: Incluir detalles que guíen a la IA (ej. "habilidades requeridas", "experiencia en años", "tecnologías específicas").
        ▪ Consideraciones Éticas (implícito): Evitar sesgos en la selección de personal (ej. no pedir información personal sensible).
    ◦ Los tres prompts a generar son:
        1. Prompt para 'Análisis y Filtrado de CVs': Dada una lista de currículums, identifica los más relevantes para el puesto.
        2. Prompt para 'Generación de Preguntas de Entrevista Técnica': Crea preguntas técnicas para la entrevista del candidato.
        3. Prompt para 'Elaboración de Resumen de Candidato': Después de una entrevista (simulada), resume los puntos fuertes y débiles de un candidato para el equipo de contratación.
    ◦ Formato de Salida: Presenta cada uno de los tres prompts generados en un bloque de texto separado, con un título claro para cada uno.`, category: Category.Otras, author: 'Equipo GeniusPrompt', createdAt: '2024-07-14T11:00:00Z', rating: 4.9, downloads: 360, isPublished: true },
];

const examplePrompts: Prompt[] = idealPrompts.map(p => ({
    ...p,
    rating: undefined,
    downloads: undefined,
}));

const initialUserPrompts = idealPrompts.slice(0, 3).map(p => ({...p, isFavorite: Math.random() > 0.7, isPublished: p.id === 'ideal-2' }));

interface AppContextType {
    prompts: Prompt[];
    communityPrompts: Prompt[];
    addPrompt: (prompt: Omit<Prompt, 'id' | 'createdAt' | 'isFavorite' | 'isPublished'>) => string;
    publishPrompt: (promptId: string) => void;
    deletePrompt: (promptId: string) => void;
    toggleFavorite: (promptId: string) => void;
    incrementDownloads: (promptId: string) => void;
    importPrompts: (fileContent: string) => void;
    
    theme: 'light' | 'dark';
    toggleTheme: () => void;
    notification: { message: string; type: 'success' | 'error' } | null;
    showNotification: (message: string, type?: 'success' | 'error') => void;
    
    generationsRemaining: number;
    decrementGenerations: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const getInitialTheme = (): 'light' | 'dark' => {
  if (typeof window !== 'undefined' && window.localStorage) {
    const storedTheme = window.localStorage.getItem('theme');
    if (storedTheme === 'dark' || storedTheme === 'light') {
      return storedTheme;
    }
    if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
      return 'dark';
    }
  }
  return 'light';
};

const TOTAL_FREE_GENERATIONS = 10;

export const AppProvider = ({ children }: PropsWithChildren<{}>): ReactNode => {
    const [prompts, setPrompts] = useState<Prompt[]>(() => {
        try {
            const storedPrompts = window.localStorage.getItem('geniusPrompt_userPrompts');
            return storedPrompts ? JSON.parse(storedPrompts) : initialUserPrompts;
        } catch (error) {
            console.error("Error loading user prompts from localStorage", error);
            return initialUserPrompts;
        }
    });

    const [communityPrompts, setCommunityPrompts] = useState<Prompt[]>(() => {
        try {
            const storedCommunityPrompts = window.localStorage.getItem('geniusPrompt_communityPrompts');
            if (storedCommunityPrompts) {
                 const parsedPrompts = JSON.parse(storedCommunityPrompts);
                return parsedPrompts.map((p: Prompt) => {
                    const isExample = idealPrompts.some(ideal => ideal.id === p.id);
                    if (isExample && p.author === 'IntelliBot') {
                        return { ...p, rating: undefined, downloads: undefined };
                    }
                    return p;
                });
            }
            return examplePrompts;
        } catch (error) {
            console.error("Error loading community prompts from localStorage", error);
            return examplePrompts;
        }
    });
    
    const [theme, setTheme] = useState<'light' | 'dark'>(getInitialTheme);
    const [notification, setNotification] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

    const [generationsRemaining, setGenerationsRemaining] = useState<number>(() => {
        try {
            const storedGenerations = window.localStorage.getItem('geniusPrompt_generations');
            if (storedGenerations !== null) {
                const count = parseInt(storedGenerations, 10);
                return isNaN(count) ? TOTAL_FREE_GENERATIONS : count;
            }
            window.localStorage.setItem('geniusPrompt_generations', String(TOTAL_FREE_GENERATIONS));
            return TOTAL_FREE_GENERATIONS;
        } catch (error) {
            console.error("Error accessing localStorage for generations count", error);
            return TOTAL_FREE_GENERATIONS;
        }
    });

     useEffect(() => {
        try {
            window.localStorage.setItem('geniusPrompt_userPrompts', JSON.stringify(prompts));
        } catch (error) {
            console.error("Error saving user prompts to localStorage", error);
        }
    }, [prompts]);

    useEffect(() => {
        try {
            window.localStorage.setItem('geniusPrompt_communityPrompts', JSON.stringify(communityPrompts));
        } catch (error) {
            console.error("Error saving community prompts to localStorage", error);
        }
    }, [communityPrompts]);

    useEffect(() => {
        try {
            window.localStorage.setItem('geniusPrompt_generations', String(generationsRemaining));
        } catch (error) {
            console.error("Error saving generations count to localStorage", error);
        }
    }, [generationsRemaining]);

    useEffect(() => {
        const root = window.document.documentElement;
        if (theme === 'dark') {
            root.classList.add('dark');
        } else {
            root.classList.remove('dark');
        }
        try {
            window.localStorage.setItem('theme', theme);
        } catch(e) {
            console.error("Could not save theme to localStorage", e);
        }
    }, [theme]);

    const toggleTheme = () => {
        setTheme(prevTheme => (prevTheme === 'light' ? 'dark' : 'light'));
    };
    
    const showNotification = (message: string, type: 'success' | 'error' = 'success') => {
        setNotification({ message, type });
        setTimeout(() => {
            setNotification(null);
        }, 3000);
    };

    const addPrompt = (promptData: Omit<Prompt, 'id' | 'createdAt' | 'isFavorite' | 'isPublished'>): string => {
        const newPrompt: Prompt = {
            ...promptData,
            id: Date.now().toString(),
            createdAt: new Date().toISOString(),
            isFavorite: false,
            isPublished: false,
        };
        setPrompts(prevPrompts => [newPrompt, ...prevPrompts]);
        showNotification('¡Prompt guardado con éxito!');
        return newPrompt.id;
    };

    const deletePrompt = (promptId: string) => {
        if(window.confirm('¿Estás seguro de que quieres eliminar este prompt? Esta acción no se puede deshacer.')){
            setPrompts(prev => prev.filter(p => p.id !== promptId));
            showNotification('Prompt eliminado.', 'error');
        }
    };

    const toggleFavorite = (promptId: string) => {
        setPrompts(prev => prev.map(p => 
            p.id === promptId ? { ...p, isFavorite: !p.isFavorite } : p
        ));
    };

    const publishPrompt = (promptId: string) => {
        let promptToPublish: Prompt | undefined;

        setPrompts(prev => prev.map(p => {
            if (p.id === promptId) {
                if (p.isPublished) return p; // Already published
                promptToPublish = { ...p, isPublished: true, author: 'Tú' };
                return promptToPublish;
            }
            return p;
        }));

        if (promptToPublish && !communityPrompts.some(p => p.id === promptId)) {
            const communityVersion = {
                ...promptToPublish,
                author: 'Tú', // Ensure author is set
                rating: 0,
                downloads: 0,
                createdAt: new Date().toISOString()
            };
            setCommunityPrompts(prev => [communityVersion, ...prev]);
            showNotification('¡Prompt publicado en la comunidad!');
        }
    };

    const incrementDownloads = (promptId: string) => {
        setCommunityPrompts(prev => prev.map(p => 
            p.id === promptId ? { ...p, downloads: (p.downloads || 0) + 1 } : p
        ));
    };

    const decrementGenerations = () => {
        setGenerationsRemaining(prev => Math.max(0, prev - 1));
    };

    const importPrompts = (fileContent: string) => {
        try {
            const imported = JSON.parse(fileContent);
            if (!Array.isArray(imported)) {
                throw new Error("El archivo no es un array de prompts válido.");
            }

            const validatedPrompts: Prompt[] = imported.filter((p: any) => 
                p.id && p.title && p.content && p.category
            ).map((p: any) => ({ // Ensure all fields are present
                ...p,
                id: p.id || Date.now().toString(),
                createdAt: p.createdAt || new Date().toISOString(),
                isFavorite: p.isFavorite || false,
                isPublished: p.isPublished || false,
            }));

            if(validatedPrompts.length === 0) {
                 showNotification('No se encontraron prompts válidos en el archivo.', 'error');
                 return;
            }

            setPrompts(prevPrompts => {
                const existingIds = new Set(prevPrompts.map(p => p.id));
                const newPrompts = validatedPrompts.filter(p => !existingIds.has(p.id));
                return [...prevPrompts, ...newPrompts];
            });

            showNotification(`¡${validatedPrompts.length} prompts importados con éxito!`);

        } catch (error) {
            console.error("Error importing prompts:", error);
            showNotification('Error al importar el archivo. Asegúrate de que es un JSON válido exportado desde esta app.', 'error');
        }
    };

    return (
        <AppContext.Provider value={{ 
            prompts, communityPrompts, addPrompt, publishPrompt, deletePrompt, toggleFavorite, incrementDownloads, importPrompts,
            theme, toggleTheme, notification, showNotification,
            generationsRemaining, decrementGenerations
        }}>
            {children}
        </AppContext.Provider>
    );
};

export const useAppContext = (): AppContextType => {
    const context = useContext(AppContext);
    if (context === undefined) {
        throw new Error('useAppContext must be used within an AppProvider');
    }
    return context;
};