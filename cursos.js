const MASTER_DB = [
    //CURSOS GENERALES
    { id: 'calc', name: "Cálculo Diferencial", cred: 5, type: "GENERIC_DROP1", inputs: 4, hasExams: true, w:{pp:1,ep:1,ef:1}, tags: {sist:1, soft:1, ind:1} },
    { id: 'geo', name: "Geometría Analítica", cred: 3, type: "GENERIC_DROP1", inputs: 4, hasExams: true, w:{pp:1,ep:1,ef:1}, tags: {sist:1, soft:1, ind:1} },
    { id: 'calc2', name: "Cálculo Integral", cred: 5, type: "GENERIC_DROP1", inputs: 4, hasExams: true, w:{pp:1,ep:1,ef:1}, tags: {sist:2, soft:2, ind:2} },
    { id: 'calc3', name: "Álgebra Lineal", cred: 4, type: "GENERIC_DROP1", inputs: 4, hasExams: true, w:{pp:1,ep:1,ef:1}, tags: {sist:2, soft:2, ind:2} },
    { id: 'calc4', name: "Cálculo Multivariable", cred: 5, type: "GENERIC_DROP1", inputs: 4, hasExams: true, w:{pp:1,ep:1,ef:1}, tags: {sist:3, soft:3, ind:3} },
    { id: 'calc5', name: "Ecuaciones Diferenciales", cred: 5, type: "GENERIC_DROP1", inputs: 4, hasExams: true, w:{pp:1,ep:1,ef:1}, tags: {sist:4, soft:4, ind:4} },

    { id: 'quim', name: "Química I", cred: 5, type: "QUIMICA", inputs: 12, hasExams: true, tags: {ind:1, sist:1, soft:1} },
    { id: 'quim2', name: "Química II", cred: 4, type: "QUIMICA", inputs: 12, hasExams: true, tags: {ind:2} },
    { id: 'termo', name: "Termodinámica", cred: 3, type: "INTROSW", inputs: 4, hasExams: true, w:{pp:1,ep:1,ef:2}, tags: {ind:3} },
    { id: 'fisi1', name: "Física I", cred: 5, type: "FISICA", inputs: 10, hasExams: true, w:{pp:1,ep:1,ef:2}, tags: {sist:3, soft:2, ind:3} },
    { id: 'fisi2', name: "Física II", cred: 5, type: "FISICA", inputs: 10, hasExams: true, w:{pp:1, ep:1, ef:1}, tags: {sist:4, soft:3, ind:4} },
    
    { id: 'discr', name: "Matemática Discreta", cred: 3, type: "GENERIC_DROP1", inputs: 4, hasExams: true, w:{pp:1,ep:1,ef:1}, tags: {sist:3, soft:2, ind:3} },
    { id: 'est1', name: "Estadística y Probabilidades", cred: 3, type: "GENERIC_DROP1", inputs: 4, hasExams: true, w:{pp:1,ep:1,ef:1}, tags: {sist:3, soft:3, ind:4} },
    { id: 'intrcomp', name: "Introducción a la Computación", cred: 2, type: "INTRO_COMP", inputs: 6, hasExams: true, w:{pp:1,ep:1,ef:2}, tags: {sist:1, soft:1, ind:2} },
    { id: 'algor', name: "Algoritmia y Estructura de Datos", cred: 3, type: "INTROSW", inputs: 4, hasExams: true, w:{pp:1,ep:1,ef:2}, tags: {sist:2, soft:2} },

    { id: 'intr', name: "Intr. a la Ing. Industrial", cred: 3, type: "INTRO", inputs: 6, hasExams: true, w:{pp:1,ep:1,ef:2}, tags: {ind:1} },
    { id: 'intrsis', name: "Intr. al Pensamiento y a la Ing. de Sistemas", cred: 3, type: "INTROSIST", inputs: 7, hasExams: true, w:{pp:1,ep:1,ef:2}, tags: {sist:1} },
    { id: 'intrsw', name: "Intr. a la Ing. de Software", cred: 3, type: "INTROSW", inputs: 4, hasExams: true, w:{pp:1,ep:1,ef:2}, tags: {soft:1} },
    
    
    { id: 'tgs', name: "Teoría General de Sistemas", cred: 2, type: "INTRO", inputs: 6, hasExams: true, w:{pp:1,ep:1,ef:2}, tags: {ind:2} },
    { id: 'tcs', name: "Teoría y Ciencia de Sistemas", cred: 3, type: "INTRO", inputs: 6, hasExams: true, w:{pp:1,ep:1,ef:1}, tags: {sist:2} },
    { id: 'tcsa', name: "Teoría y Ciencia de Sistemas Aplicados", cred: 2, type: "INTRO", inputs: 6, hasExams: true, w:{pp:1,ep:1,ef:1}, tags: {sist:3} },
    { id: 'sistbio', name: "Sistemas Biológicos y Ecológicos", cred: 2, type: "5Pcs-1Mon", inputs: 6, hasExams: true, w:{pp:1,ep:1,ef:1}, tags: {sist:2} },
    { id: 'psicosist', name: "Psicología Sistémica", cred: 3, type: "4Pcs-1Mon", inputs: 5, hasExams: true, w:{pp:1,ep:1,ef:1}, tags: {sist:2} },

    { id: 'com1', name: "Redacción y Comunicación", cred: 2, type: "REDACCION", inputs: 6, hasExams: false, tags: {sist:1, soft:1, ind:1} },
    { id: 'eti', name: "Ética y Filosofía Política", cred: 2, type: "ETICA", inputs: 5, hasExams: false, tags: {sist:2, soft:4, ind:1} },
    { id: 'desp', name: "Desarrollo Personal", cred: 2, type: "REDACCION", inputs: 6, hasExams: false, tags: {sist:4, soft:1, ind:2} },
    { id: 'metod', name: "Metodología de la Investigación", cred: 2, type: "ETICA", inputs: 5, hasExams: false, tags: {sist:3, ind:3} },
    { id: 'realidad', name: "Realidad Nacional, Const. y DDHH", cred: 3, type: "REALIDAD", inputs: 4, hasExams: false, tags: {ind:2, sist:5, soft:5} },
    { id: 'socio', name: "Sociología", cred: 2, type: "SOCIO", inputs: 0, hasExams: true, w:{pp:0,ep:1,ef:2}, tags: {ind:5} },
    { id: 'econo', name: "Economía General", cred: 3, type: "INTRO_COMP", inputs: 4, hasExams: true, w:{pp:1,ep:1,ef:2}, tags: {sist:3, soft:3, ind:4} },

    { id: 'dib', name: "Dibujo de Ingeniería", cred: 2, type: "DIBUJO", inputs: 6, hasExams: false, tags: {ind:1} },
    { id: 'dib', name: "Dibujo y Geometría Descriptiva", cred: 2, type: "DIBUJO", inputs: 6, hasExams: false, tags: {sist:'ELEC', soft:2} },
    { id: 'dac', name: "Diseño Asistido por Computador", cred: 3, type: "DACOMP", inputs: 8, hasExams: false, tags: {ind:3} },

    
    
    
    
    
];