/**
 * SERRARIA & MADEIREIRA ERP - BANCO DE DADOS & SEED DATA (LOCALSTORAGE)
 * Dados reais e estruturados de uma madeireira brasileira.
 */

const STORAGE_KEYS = {
  PRODUTOS: 'serraria_produtos_v4',
  CLIENTES: 'serraria_clientes_v1',
  CARPINTEIROS: 'serraria_carpinteiros_v1',
  PEDIDOS: 'serraria_pedidos_v1',
  BAIRROS: 'serraria_bairros_v1',
  CONFIG: 'serraria_config_v1',
  FUNCIONARIOS: 'serraria_funcionarios_v1',
  PAGAMENTOS_COMISSAO: 'serraria_pagamentos_comissao_v1',
  AUDITORIA_DESCONTOS: 'serraria_auditoria_descontos_v1',
  USUARIOS: 'serraria_usuarios_v1'
};

const SEED_PRODUTOS = [
  {"id":"prod_1","codigo":"1-001","nome":"ABRAÇADEIRA 3,5X200MM (UNID) 100","categoria":"Ferragens & Cercas","especie":"Aço Galvanizado","tipo_calculo":"UN","unidade_medida":"UN","preco_unitario":0.25,"taxa_plaina_padrao":0,"estoque_atual":45,"estoque_minimo":10,"ativo":true},
  {"id":"prod_2","codigo":"1-002","nome":"ABRAÇADEIRA 3,5X300MM (UNID) 100","categoria":"Ferragens & Cercas","especie":"Aço Galvanizado","tipo_calculo":"UN","unidade_medida":"UN","preco_unitario":0.4,"taxa_plaina_padrao":0,"estoque_atual":45,"estoque_minimo":10,"ativo":true},
  {"id":"prod_3","codigo":"1-003","nome":"ABRAÇADEIRA 4,8X300MM (UNID) 100","categoria":"Ferragens & Cercas","especie":"Aço Galvanizado","tipo_calculo":"UN","unidade_medida":"UN","preco_unitario":0.6,"taxa_plaina_padrao":0,"estoque_atual":45,"estoque_minimo":10,"ativo":true},
  {"id":"prod_4","codigo":"1-004","nome":"ABRAÇADEIRA 7,6X200MM (UNID) 50","categoria":"Ferragens & Cercas","especie":"Aço Galvanizado","tipo_calculo":"UN","unidade_medida":"UN","preco_unitario":0.65,"taxa_plaina_padrao":0,"estoque_atual":45,"estoque_minimo":10,"ativo":true},
  {"id":"prod_5","codigo":"1-005","nome":"ABRAÇADEIRA 7,6X300MM (UNID) 50","categoria":"Ferragens & Cercas","especie":"Aço Galvanizado","tipo_calculo":"UN","unidade_medida":"UN","preco_unitario":0.7,"taxa_plaina_padrao":0,"estoque_atual":45,"estoque_minimo":10,"ativo":true},
  {"id":"prod_6","codigo":"1-006","nome":"ABRAÇADEIRA ROSCA 1/2 X 3/4 (UNID) 100","categoria":"Ferragens & Cercas","especie":"Aço Galvanizado","tipo_calculo":"UN","unidade_medida":"UN","preco_unitario":2.2,"taxa_plaina_padrao":0,"estoque_atual":45,"estoque_minimo":10,"ativo":true},
  {"id":"prod_7","codigo":"1-007","nome":"ABRAÇADEIRA ZINC. TIPO U 3/4 INCA (UNID) 100","categoria":"Ferragens & Cercas","especie":"Aço Galvanizado","tipo_calculo":"UN","unidade_medida":"UN","preco_unitario":1.1,"taxa_plaina_padrao":0,"estoque_atual":45,"estoque_minimo":10,"ativo":true},
  {"id":"prod_8","codigo":"1-008","nome":"ADAP MARROM SOLDAVEL 20MM 1/2 KRONA","categoria":"Hidráulica & Conexões","especie":"PVC / Metal","tipo_calculo":"UN","unidade_medida":"UN","preco_unitario":1.5,"taxa_plaina_padrao":0,"estoque_atual":70,"estoque_minimo":20,"ativo":true},
  {"id":"prod_9","codigo":"1-009","nome":"ADAP MARROM SOLDAVEL 25MM 3/4 KRONA","categoria":"Hidráulica & Conexões","especie":"PVC / Metal","tipo_calculo":"UN","unidade_medida":"UN","preco_unitario":1.6,"taxa_plaina_padrao":0,"estoque_atual":70,"estoque_minimo":20,"ativo":true},
  {"id":"prod_10","codigo":"1-010","nome":"ADAP MARROM SOLDAVEL 32MM 1\" KRONA","categoria":"Hidráulica & Conexões","especie":"PVC / Metal","tipo_calculo":"UN","unidade_medida":"UN","preco_unitario":3.4,"taxa_plaina_padrao":0,"estoque_atual":70,"estoque_minimo":20,"ativo":true},
  {"id":"prod_11","codigo":"1-011","nome":"ADAP MARROM SOLDAVEL 50MM 1.1/2 KROMA","categoria":"Hidráulica & Conexões","especie":"PVC / Metal","tipo_calculo":"UN","unidade_medida":"UN","preco_unitario":8.4,"taxa_plaina_padrao":0,"estoque_atual":70,"estoque_minimo":20,"ativo":true},
  {"id":"prod_12","codigo":"1-012","nome":"ADAPITADOR 1/2 R EXTERNA PRETO PLASBOHN PÇ","categoria":"Hidráulica & Conexões","especie":"PVC / Metal","tipo_calculo":"UN","unidade_medida":"UN","preco_unitario":4.6,"taxa_plaina_padrao":0,"estoque_atual":70,"estoque_minimo":20,"ativo":true},
  {"id":"prod_13","codigo":"1-013","nome":"ADAPITADOR 3/4 R EXTERNA PRETO PLASBOHN PÇ","categoria":"Hidráulica & Conexões","especie":"PVC / Metal","tipo_calculo":"UN","unidade_medida":"UN","preco_unitario":4.6,"taxa_plaina_padrao":0,"estoque_atual":70,"estoque_minimo":20,"ativo":true},
  {"id":"prod_14","codigo":"MAT-014","nome":"ADAPT CX DAGUA FLANGE SOLD 25MMX3/4 PLASTUBOS","categoria":"Hidráulica & Conexões","especie":"PVC / Metal","tipo_calculo":"UN","unidade_medida":"UN","preco_unitario":11,"taxa_plaina_padrao":0,"estoque_atual":70,"estoque_minimo":20,"ativo":true},
  {"id":"prod_15","codigo":"1-016","nome":"ADESIVO PLASTICO (COLA TUBO) 175G","categoria":"Tintas & Química","especie":"Químico","tipo_calculo":"UN","unidade_medida":"UN","preco_unitario":24.6,"taxa_plaina_padrao":0,"estoque_atual":35,"estoque_minimo":10,"ativo":true},
  {"id":"prod_16","codigo":"MAT-016","nome":"ADESIVO PLASTICO (COLA TUBO) 175G TIGRE","categoria":"Tintas & Química","especie":"Químico","tipo_calculo":"UN","unidade_medida":"UN","preco_unitario":24.6,"taxa_plaina_padrao":0,"estoque_atual":0,"estoque_minimo":10,"ativo":true},
  {"id":"prod_17","codigo":"1-015","nome":"ADESIVO PLASTICO (COLA TUBO) 17G","categoria":"Tintas & Química","especie":"Químico","tipo_calculo":"UN","unidade_medida":"UN","preco_unitario":5.55,"taxa_plaina_padrao":0,"estoque_atual":35,"estoque_minimo":10,"ativo":true},
  {"id":"prod_18","codigo":"MAT-018","nome":"ADESIVO PLASTICO (COLA TUBO) 17G TIGRE","categoria":"Tintas & Química","especie":"Químico","tipo_calculo":"UN","unidade_medida":"UN","preco_unitario":5.55,"taxa_plaina_padrao":0,"estoque_atual":35,"estoque_minimo":10,"ativo":true},
  {"id":"prod_19","codigo":"1-014","nome":"ADESIVO PLASTICO (COLA TUBO) 75G","categoria":"Tintas & Química","especie":"Químico","tipo_calculo":"UN","unidade_medida":"UN","preco_unitario":10.05,"taxa_plaina_padrao":0,"estoque_atual":35,"estoque_minimo":10,"ativo":true},
  {"id":"prod_20","codigo":"MAT-020","nome":"ADESIVO PLASTICO (COLA TUBO) 75G TIGRE","categoria":"Tintas & Química","especie":"Químico","tipo_calculo":"UN","unidade_medida":"UN","preco_unitario":10.04,"taxa_plaina_padrao":0,"estoque_atual":35,"estoque_minimo":10,"ativo":true},
  {"id":"prod_21","codigo":"MAT-021","nome":"ADESIVO PLASTICO (COLA TUBO) POLYTUB 175G","categoria":"Tintas & Química","especie":"Químico","tipo_calculo":"UN","unidade_medida":"UN","preco_unitario":27.75,"taxa_plaina_padrao":0,"estoque_atual":35,"estoque_minimo":10,"ativo":true},
  {"id":"prod_22","codigo":"1-017","nome":"ADESIVO PLÁSTICO 175 GR C/ PINCEL AMANCO","categoria":"Tintas & Química","especie":"Químico","tipo_calculo":"UN","unidade_medida":"UN","preco_unitario":42.6,"taxa_plaina_padrao":0,"estoque_atual":35,"estoque_minimo":10,"ativo":true},
  {"id":"prod_23","codigo":"1-018","nome":"ADESIVO PLÁSTICO 175 GR C/ PINCEL KRONA","categoria":"Tintas & Química","especie":"Químico","tipo_calculo":"UN","unidade_medida":"UN","preco_unitario":27.75,"taxa_plaina_padrao":0,"estoque_atual":35,"estoque_minimo":10,"ativo":true},
  {"id":"prod_24","codigo":"MAT-024","nome":"AFIADOR DE METAL P/ FACAS","categoria":"Ferramentas & Acessórios","especie":"Aço / Ferramental","tipo_calculo":"UN","unidade_medida":"UN","preco_unitario":30,"taxa_plaina_padrao":0,"estoque_atual":25,"estoque_minimo":5,"ativo":true},
  {"id":"prod_25","codigo":"MAT-025","nome":"AGUARRAS 5 L ITAQUA","categoria":"Tintas & Química","especie":"Químico","tipo_calculo":"UN","unidade_medida":"UN","preco_unitario":115.5,"taxa_plaina_padrao":0,"estoque_atual":3,"estoque_minimo":15,"ativo":true},
  {"id":"prod_26","codigo":"MAT-026","nome":"AGUARRAS 900 ML ITAQUA","categoria":"Tintas & Química","especie":"Químico","tipo_calculo":"UN","unidade_medida":"UN","preco_unitario":27.5,"taxa_plaina_padrao":0,"estoque_atual":35,"estoque_minimo":10,"ativo":true},
  {"id":"prod_27","codigo":"MAT-027","nome":"AGUARRAS ITAQUA 5 LITROS","categoria":"Tintas & Química","especie":"Químico","tipo_calculo":"UN","unidade_medida":"UN","preco_unitario":109.2,"taxa_plaina_padrao":0,"estoque_atual":35,"estoque_minimo":10,"ativo":true},
  {"id":"prod_28","codigo":"MAT-028","nome":"AGUARRAS ITAQUA 900 ML","categoria":"Tintas & Química","especie":"Químico","tipo_calculo":"UN","unidade_medida":"UN","preco_unitario":21.9,"taxa_plaina_padrao":0,"estoque_atual":35,"estoque_minimo":10,"ativo":true},
  {"id":"prod_29","codigo":"1-022","nome":"ALICATE BICO MEIA CANA 6","categoria":"Forros & Acabamentos","especie":"Diversos","tipo_calculo":"UN","unidade_medida":"UN","preco_unitario":400.5,"taxa_plaina_padrao":0,"estoque_atual":40,"estoque_minimo":10,"ativo":true},
  {"id":"prod_30","codigo":"1-023","nome":"ALICATE BICO MEIA CANA 6 MTX","categoria":"Forros & Acabamentos","especie":"Diversos","tipo_calculo":"UN","unidade_medida":"UN","preco_unitario":27.3,"taxa_plaina_padrao":0,"estoque_atual":40,"estoque_minimo":10,"ativo":true},
  {"id":"prod_31","codigo":"1-024","nome":"ALICATE BICO RETO 6 PREMIUM THOMPSO N 2","categoria":"Ferramentas & Acessórios","especie":"Aço / Ferramental","tipo_calculo":"UN","unidade_medida":"UN","preco_unitario":33,"taxa_plaina_padrao":0,"estoque_atual":25,"estoque_minimo":5,"ativo":true},
  {"id":"prod_32","codigo":"1-025","nome":"ALICATE CORTE DIAGONAL 5 FOXLUX 36.01","categoria":"Ferramentas & Acessórios","especie":"Aço / Ferramental","tipo_calculo":"UN","unidade_medida":"UN","preco_unitario":44.1,"taxa_plaina_padrao":0,"estoque_atual":25,"estoque_minimo":5,"ativo":true},
  {"id":"prod_33","codigo":"1-026","nome":"ALICATE CORTE DIAGONAL 6","categoria":"Ferramentas & Acessórios","especie":"Aço / Ferramental","tipo_calculo":"UN","unidade_medida":"UN","preco_unitario":18,"taxa_plaina_padrao":0,"estoque_atual":25,"estoque_minimo":5,"ativo":true},
  {"id":"prod_34","codigo":"1-027","nome":"ALICATE REBITADOR 9,5","categoria":"Ferramentas & Acessórios","especie":"Aço / Ferramental","tipo_calculo":"UN","unidade_medida":"UN","preco_unitario":25.2,"taxa_plaina_padrao":0,"estoque_atual":25,"estoque_minimo":5,"ativo":true},
  {"id":"prod_35","codigo":"1-028","nome":"ALICATE UNIVERSAL 8\" (203 MM)  STARFER","categoria":"Ferramentas & Acessórios","especie":"Aço / Ferramental","tipo_calculo":"UN","unidade_medida":"UN","preco_unitario":51.75,"taxa_plaina_padrao":0,"estoque_atual":25,"estoque_minimo":5,"ativo":true},
  {"id":"prod_36","codigo":"1-029","nome":"ALICATE UNIVERSAL 8\" TRAMONTINA","categoria":"Ferramentas & Acessórios","especie":"Aço / Ferramental","tipo_calculo":"UN","unidade_medida":"UN","preco_unitario":50.85,"taxa_plaina_padrao":0,"estoque_atual":25,"estoque_minimo":5,"ativo":true},
  {"id":"prod_37","codigo":"MAT-037","nome":"ANEL VEDAÇÃO","categoria":"Hidráulica & Conexões","especie":"PVC / Metal","tipo_calculo":"UN","unidade_medida":"UN","preco_unitario":13.35,"taxa_plaina_padrao":0,"estoque_atual":70,"estoque_minimo":20,"ativo":true},
  {"id":"prod_38","codigo":"MAT-038","nome":"APAPT CX DAGUA FLANGE SOLD 50MMX1.1/2 PLASTUBOS","categoria":"Hidráulica & Conexões","especie":"PVC / Metal","tipo_calculo":"UN","unidade_medida":"UN","preco_unitario":22,"taxa_plaina_padrao":0,"estoque_atual":70,"estoque_minimo":20,"ativo":true},
  {"id":"prod_39","codigo":"1-030","nome":"APAPTADOR MARROM FLANGE 50MM","categoria":"Hidráulica & Conexões","especie":"PVC / Metal","tipo_calculo":"UN","unidade_medida":"UN","preco_unitario":0.6,"taxa_plaina_padrao":0,"estoque_atual":70,"estoque_minimo":20,"ativo":true},
  {"id":"prod_40","codigo":"1-031","nome":"ARAME FARPADO ELEFANTE 250M 2.2","categoria":"Ferragens & Cercas","especie":"Aço Galvanizado","tipo_calculo":"UN","unidade_medida":"UN","preco_unitario":420,"taxa_plaina_padrao":0,"estoque_atual":45,"estoque_minimo":10,"ativo":true},
  {"id":"prod_41","codigo":"1-032","nome":"ARAME FARPADO ELEFANTE 400M 2.2","categoria":"Ferragens & Cercas","especie":"Aço Galvanizado","tipo_calculo":"UN","unidade_medida":"UN","preco_unitario":642,"taxa_plaina_padrao":0,"estoque_atual":45,"estoque_minimo":10,"ativo":true},
  {"id":"prod_42","codigo":"MAT-042","nome":"ARAME FARPADO MF 250M","categoria":"Ferragens & Cercas","especie":"Aço Galvanizado","tipo_calculo":"UN","unidade_medida":"UN","preco_unitario":247.5,"taxa_plaina_padrao":0,"estoque_atual":45,"estoque_minimo":10,"ativo":true},
  {"id":"prod_43","codigo":"1-033","nome":"ARAME FARPADO MF 250M 1.6","categoria":"Ferragens & Cercas","especie":"Aço Galvanizado","tipo_calculo":"UN","unidade_medida":"UN","preco_unitario":288,"taxa_plaina_padrao":0,"estoque_atual":45,"estoque_minimo":10,"ativo":true},
  {"id":"prod_44","codigo":"MAT-044","nome":"ARAME FARPADO MF 400M","categoria":"Ferragens & Cercas","especie":"Aço Galvanizado","tipo_calculo":"UN","unidade_medida":"UN","preco_unitario":393,"taxa_plaina_padrao":0,"estoque_atual":45,"estoque_minimo":10,"ativo":true},
  {"id":"prod_45","codigo":"1-034","nome":"ARAME FARPADO MF 400M 1.6","categoria":"Ferragens & Cercas","especie":"Aço Galvanizado","tipo_calculo":"UN","unidade_medida":"UN","preco_unitario":450,"taxa_plaina_padrao":0,"estoque_atual":45,"estoque_minimo":10,"ativo":true},
  {"id":"prod_46","codigo":"1-035","nome":"ARAME GALVANIZADO  Nº 14 / 1KG 2.11MM","categoria":"Ferragens & Cercas","especie":"Aço Galvanizado","tipo_calculo":"UN","unidade_medida":"KG","preco_unitario":22.05,"taxa_plaina_padrao":0,"estoque_atual":45,"estoque_minimo":10,"ativo":true},
  {"id":"prod_47","codigo":"MAT-047","nome":"ARAME GALVANIZADO  Nº 14 / 1KG=1,65MM BELGO","categoria":"Ferragens & Cercas","especie":"Aço Galvanizado","tipo_calculo":"UN","unidade_medida":"KG","preco_unitario":27.5,"taxa_plaina_padrao":0,"estoque_atual":45,"estoque_minimo":10,"ativo":true},
  {"id":"prod_48","codigo":"1-036","nome":"ARAME GALVANIZADO  Nº 16 / 1KG 1.65MM","categoria":"Ferragens & Cercas","especie":"Aço Galvanizado","tipo_calculo":"UN","unidade_medida":"KG","preco_unitario":23.55,"taxa_plaina_padrao":0,"estoque_atual":45,"estoque_minimo":10,"ativo":true},
  {"id":"prod_49","codigo":"1-037","nome":"ARAME GALVANIZADO  Nº 18 / 1KG 1.24MM","categoria":"Ferragens & Cercas","especie":"Aço Galvanizado","tipo_calculo":"UN","unidade_medida":"KG","preco_unitario":28.35,"taxa_plaina_padrao":0,"estoque_atual":45,"estoque_minimo":10,"ativo":true},
  {"id":"prod_50","codigo":"MAT-050","nome":"ARAME GALVANIZADO  Nº 18 / 1KG=1,24MM BELGO","categoria":"Ferragens & Cercas","especie":"Aço Galvanizado","tipo_calculo":"UN","unidade_medida":"KG","preco_unitario":33,"taxa_plaina_padrao":0,"estoque_atual":45,"estoque_minimo":10,"ativo":true},
  {"id":"prod_51","codigo":"MAT-051","nome":"ARAME GALVANIZADO  Nº 20 / 1KG=0,89MM BELGO","categoria":"Ferragens & Cercas","especie":"Aço Galvanizado","tipo_calculo":"UN","unidade_medida":"KG","preco_unitario":44,"taxa_plaina_padrao":0,"estoque_atual":45,"estoque_minimo":10,"ativo":true},
  {"id":"prod_52","codigo":"1-038","nome":"ARAME RECOZIDO TORCIDO 1 KG","categoria":"Ferragens & Cercas","especie":"Aço Galvanizado","tipo_calculo":"UN","unidade_medida":"KG","preco_unitario":19.6,"taxa_plaina_padrao":0,"estoque_atual":45,"estoque_minimo":10,"ativo":true},
  {"id":"prod_53","codigo":"1-039","nome":"ARCO DE SERRA FIXO 12","categoria":"Ferramentas & Acessórios","especie":"Aço / Ferramental","tipo_calculo":"UN","unidade_medida":"UN","preco_unitario":25.5,"taxa_plaina_padrao":0,"estoque_atual":25,"estoque_minimo":5,"ativo":true},
  {"id":"prod_54","codigo":"MAT-054","nome":"ARCO DE SERRA FIXO CABO PRETO BB 12\" THOMPSON","categoria":"Ferramentas & Acessórios","especie":"Aço / Ferramental","tipo_calculo":"UN","unidade_medida":"UN","preco_unitario":25,"taxa_plaina_padrao":0,"estoque_atual":25,"estoque_minimo":5,"ativo":true},
  {"id":"prod_55","codigo":"MAT-055","nome":"ARMARIO ESPELHO 38,5X9X34,5 IMPERIAL","categoria":"Construção & Alvenaria","especie":"Diversos","tipo_calculo":"UN","unidade_medida":"UN","preco_unitario":52,"taxa_plaina_padrao":0,"estoque_atual":8,"estoque_minimo":2,"ativo":true},
  {"id":"prod_56","codigo":"1-041","nome":"ARO CANO LONGO CARRINHO DE MÃO","categoria":"Ferramentas & Acessórios","especie":"Aço / Ferramental","tipo_calculo":"UN","unidade_medida":"UN","preco_unitario":51,"taxa_plaina_padrao":0,"estoque_atual":25,"estoque_minimo":5,"ativo":true},
  {"id":"prod_57","codigo":"MAT-057","nome":"ARRUELA LISA ZINCADA 1/2","categoria":"Fixação & Pregos","especie":"Aço","tipo_calculo":"UN","unidade_medida":"UN","preco_unitario":0.6,"taxa_plaina_padrao":0,"estoque_atual":120,"estoque_minimo":30,"ativo":true},
  {"id":"prod_58","codigo":"1-042","nome":"ARRUELA LISA ZINCADA 1/2 - 90 PÇ","categoria":"Fixação & Pregos","especie":"Aço","tipo_calculo":"UN","unidade_medida":"UN","preco_unitario":0.8,"taxa_plaina_padrao":0,"estoque_atual":120,"estoque_minimo":30,"ativo":true},
  {"id":"prod_59","codigo":"MAT-059","nome":"ARRUELA LISA ZINCADA 1/4","categoria":"Fixação & Pregos","especie":"Aço","tipo_calculo":"UN","unidade_medida":"UN","preco_unitario":0.2,"taxa_plaina_padrao":0,"estoque_atual":120,"estoque_minimo":30,"ativo":true},
  {"id":"prod_60","codigo":"1-043","nome":"ARRUELA LISA ZINCADA 1/4 - 400 PÇ","categoria":"Fixação & Pregos","especie":"Aço","tipo_calculo":"UN","unidade_medida":"UN","preco_unitario":0.2,"taxa_plaina_padrao":0,"estoque_atual":120,"estoque_minimo":30,"ativo":true},
  {"id":"prod_61","codigo":"MAT-061","nome":"ARRUELA LISA ZINCADA 3/16","categoria":"Fixação & Pregos","especie":"Aço","tipo_calculo":"UN","unidade_medida":"UN","preco_unitario":0.1,"taxa_plaina_padrao":0,"estoque_atual":120,"estoque_minimo":30,"ativo":true},
  {"id":"prod_62","codigo":"1-044","nome":"ARRUELA LISA ZINCADA 3/16 - 700 PÇ","categoria":"Fixação & Pregos","especie":"Aço","tipo_calculo":"UN","unidade_medida":"UN","preco_unitario":0.3,"taxa_plaina_padrao":0,"estoque_atual":120,"estoque_minimo":30,"ativo":true},
  {"id":"prod_63","codigo":"MAT-063","nome":"ARRUELA LISA ZINCADA 3/8","categoria":"Fixação & Pregos","especie":"Aço","tipo_calculo":"UN","unidade_medida":"UN","preco_unitario":0.3,"taxa_plaina_padrao":0,"estoque_atual":120,"estoque_minimo":30,"ativo":true},
  {"id":"prod_64","codigo":"1-045","nome":"ARRUELA LISA ZINCADA 3/8 - 220 PÇ","categoria":"Fixação & Pregos","especie":"Aço","tipo_calculo":"UN","unidade_medida":"UN","preco_unitario":0.3,"taxa_plaina_padrao":0,"estoque_atual":120,"estoque_minimo":30,"ativo":true},
  {"id":"prod_65","codigo":"MAT-065","nome":"ARRUELA LISA ZINCADA 5/16","categoria":"Fixação & Pregos","especie":"Aço","tipo_calculo":"UN","unidade_medida":"UN","preco_unitario":0.2,"taxa_plaina_padrao":0,"estoque_atual":120,"estoque_minimo":30,"ativo":true},
  {"id":"prod_66","codigo":"1-046","nome":"ARRUELA LISA ZINCADA 5/16 - 330 PÇ","categoria":"Fixação & Pregos","especie":"Aço","tipo_calculo":"UN","unidade_medida":"UN","preco_unitario":0.2,"taxa_plaina_padrao":0,"estoque_atual":120,"estoque_minimo":30,"ativo":true},
  {"id":"prod_67","codigo":"MAT-067","nome":"ASSENTO SAN LOFT BRANCO METASUL","categoria":"Construção & Alvenaria","especie":"Diversos","tipo_calculo":"UN","unidade_medida":"UN","preco_unitario":30,"taxa_plaina_padrao":0,"estoque_atual":8,"estoque_minimo":2,"ativo":true},
  {"id":"prod_68","codigo":"MAT-068","nome":"BAINHA P/ FACÃO Nº 12","categoria":"Ferramentas & Acessórios","especie":"Aço / Ferramental","tipo_calculo":"UN","unidade_medida":"UN","preco_unitario":21.3,"taxa_plaina_padrao":0,"estoque_atual":25,"estoque_minimo":5,"ativo":true},
  {"id":"prod_69","codigo":"1-048","nome":"BAINHA P/ FACÃO Nº 16","categoria":"Ferramentas & Acessórios","especie":"Aço / Ferramental","tipo_calculo":"UN","unidade_medida":"UN","preco_unitario":30.6,"taxa_plaina_padrao":0,"estoque_atual":25,"estoque_minimo":5,"ativo":true},
  {"id":"prod_70","codigo":"1-049","nome":"BAINHA P/ FACÃO Nº 18","categoria":"Ferramentas & Acessórios","especie":"Aço / Ferramental","tipo_calculo":"UN","unidade_medida":"UN","preco_unitario":32.7,"taxa_plaina_padrao":0,"estoque_atual":25,"estoque_minimo":5,"ativo":true},
  {"id":"prod_71","codigo":"MAT-071","nome":"BALDE PLASTICO 14L OVAL TRANSP.","categoria":"Construção & Alvenaria","especie":"Diversos","tipo_calculo":"UN","unidade_medida":"UN","preco_unitario":52,"taxa_plaina_padrao":0,"estoque_atual":8,"estoque_minimo":2,"ativo":true},
  {"id":"prod_72","codigo":"MAT-072","nome":"BANQUETA ALUMINIO 3 DEGRAUS ÁGATA","categoria":"Ferramentas & Acessórios","especie":"Alumínio","tipo_calculo":"UN","unidade_medida":"UN","preco_unitario":192.9,"taxa_plaina_padrao":0,"estoque_atual":25,"estoque_minimo":5,"ativo":true},
  {"id":"prod_73","codigo":"1-052","nome":"BARRA ROSQUEADA 1/2 X 1M","categoria":"Fixação & Pregos","especie":"Aço","tipo_calculo":"UN","unidade_medida":"UN","preco_unitario":17.7,"taxa_plaina_padrao":0,"estoque_atual":120,"estoque_minimo":30,"ativo":true},
  {"id":"prod_74","codigo":"1-053","nome":"BARRA ROSQUEADA 1/4 X 1M","categoria":"Fixação & Pregos","especie":"Aço","tipo_calculo":"UN","unidade_medida":"UN","preco_unitario":4.2,"taxa_plaina_padrao":0,"estoque_atual":120,"estoque_minimo":30,"ativo":true},
  {"id":"prod_75","codigo":"1-054","nome":"BARRA ROSQUEADA 3/16 X 1M","categoria":"Fixação & Pregos","especie":"Aço","tipo_calculo":"UN","unidade_medida":"UN","preco_unitario":4.5,"taxa_plaina_padrao":0,"estoque_atual":120,"estoque_minimo":30,"ativo":true},
  {"id":"prod_76","codigo":"1-055","nome":"BARRA ROSQUEADA 3/8 X 1M","categoria":"Fixação & Pregos","especie":"Aço","tipo_calculo":"UN","unidade_medida":"UN","preco_unitario":9.6,"taxa_plaina_padrao":0,"estoque_atual":120,"estoque_minimo":30,"ativo":true},
  {"id":"prod_77","codigo":"1-056","nome":"BARRA ROSQUEADA 5/16 X 1M","categoria":"Fixação & Pregos","especie":"Aço","tipo_calculo":"UN","unidade_medida":"UN","preco_unitario":7.05,"taxa_plaina_padrao":0,"estoque_atual":120,"estoque_minimo":30,"ativo":true},
  {"id":"prod_78","codigo":"1-057","nome":"BASE VALVULA DESCARGA 1.1/2 HYDRA","categoria":"Hidráulica & Conexões","especie":"PVC / Metal","tipo_calculo":"UN","unidade_medida":"UN","preco_unitario":210,"taxa_plaina_padrao":0,"estoque_atual":70,"estoque_minimo":20,"ativo":true},
  {"id":"prod_79","codigo":"1-058","nome":"BATENTE TAUARI CADA 215X14X3","categoria":"Madeiras & Esquadrias","especie":"Tauari","tipo_calculo":"UN","unidade_medida":"UN","preco_unitario":220.5,"taxa_plaina_padrao":0,"estoque_atual":15,"estoque_minimo":5,"ativo":true},
  {"id":"prod_80","codigo":"1-059","nome":"BATENTE TAUARI JOGO 215X16X3","categoria":"Madeiras & Esquadrias","especie":"Tauari","tipo_calculo":"UN","unidade_medida":"UN","preco_unitario":267,"taxa_plaina_padrao":0,"estoque_atual":15,"estoque_minimo":5,"ativo":true},
  {"id":"prod_81","codigo":"MAT-081","nome":"BATENTE TAUARI JOGO 215X18X3","categoria":"Madeiras & Esquadrias","especie":"Tauari","tipo_calculo":"UN","unidade_medida":"UN","preco_unitario":330,"taxa_plaina_padrao":0,"estoque_atual":15,"estoque_minimo":5,"ativo":true},
  {"id":"prod_82","codigo":"MAT-082","nome":"BATENTE TAUARI JOGO 215X20X3","categoria":"Madeiras & Esquadrias","especie":"Tauari","tipo_calculo":"UN","unidade_medida":"UN","preco_unitario":340,"taxa_plaina_padrao":0,"estoque_atual":15,"estoque_minimo":5,"ativo":true},
  {"id":"prod_83","codigo":"1-060","nome":"BATIDA DE PEDRA 3,6 L MAZA (PRETO, BRANCO )","categoria":"Tintas & Química","especie":"Químico","tipo_calculo":"UN","unidade_medida":"UN","preco_unitario":87,"taxa_plaina_padrao":0,"estoque_atual":35,"estoque_minimo":10,"ativo":true},
  {"id":"prod_84","codigo":"1-061","nome":"BATIDA DE PEDRA 900 ML MAZA (PRETO, BRANCO )","categoria":"Tintas & Química","especie":"Químico","tipo_calculo":"UN","unidade_medida":"UN","preco_unitario":25.5,"taxa_plaina_padrao":0,"estoque_atual":35,"estoque_minimo":10,"ativo":true},
  {"id":"prod_85","codigo":"1-062","nome":"BICO AREJADOR TORNEIRA JAPONES GARRA","categoria":"Hidráulica & Conexões","especie":"PVC / Metal","tipo_calculo":"UN","unidade_medida":"UN","preco_unitario":4.5,"taxa_plaina_padrao":0,"estoque_atual":70,"estoque_minimo":20,"ativo":true},
  {"id":"prod_86","codigo":"1-063","nome":"BICO TORNEIRA FERRO PRATA KIT METAIS","categoria":"Hidráulica & Conexões","especie":"PVC / Metal","tipo_calculo":"UN","unidade_medida":"UN","preco_unitario":9,"taxa_plaina_padrao":0,"estoque_atual":3,"estoque_minimo":15,"ativo":true},
  {"id":"prod_87","codigo":"1-064","nome":"BICO TORNEIRA METAL ZAMAC 1/2 PÇ","categoria":"Hidráulica & Conexões","especie":"PVC / Metal","tipo_calculo":"UN","unidade_medida":"UN","preco_unitario":4,"taxa_plaina_padrao":0,"estoque_atual":70,"estoque_minimo":20,"ativo":true},
  {"id":"prod_88","codigo":"1-065","nome":"BICO TORNEIRA METAL ZAMAC 3/4 PÇ","categoria":"Hidráulica & Conexões","especie":"PVC / Metal","tipo_calculo":"UN","unidade_medida":"UN","preco_unitario":2.6,"taxa_plaina_padrao":0,"estoque_atual":70,"estoque_minimo":20,"ativo":true},
  {"id":"prod_89","codigo":"1-066","nome":"BITS P/ PARAFUSADEIRA SIMPLES (UM)","categoria":"Fixação & Pregos","especie":"Aço","tipo_calculo":"UN","unidade_medida":"UN","preco_unitario":3.6,"taxa_plaina_padrao":0,"estoque_atual":120,"estoque_minimo":30,"ativo":true},
  {"id":"prod_90","codigo":"1-067","nome":"BLOCO CANALETA D/ CIMENTO 14X19X39","categoria":"Construção & Alvenaria","especie":"Concreto","tipo_calculo":"UN","unidade_medida":"UN","preco_unitario":3.5,"taxa_plaina_padrao":0,"estoque_atual":1500,"estoque_minimo":300,"ativo":true},
  {"id":"prod_91","codigo":"1-068","nome":"BLOCO D/ CIMENTO 14X19X39","categoria":"Construção & Alvenaria","especie":"Concreto","tipo_calculo":"UN","unidade_medida":"UN","preco_unitario":2.8,"taxa_plaina_padrao":0,"estoque_atual":1500,"estoque_minimo":300,"ativo":true},
  {"id":"prod_92","codigo":"1-069","nome":"BLOCO DE ESPUMA AMARELO  22X13X5,5 CM","categoria":"Construção & Alvenaria","especie":"Diversos","tipo_calculo":"UN","unidade_medida":"UN","preco_unitario":6,"taxa_plaina_padrao":0,"estoque_atual":1500,"estoque_minimo":300,"ativo":true},
  {"id":"prod_93","codigo":"1-070","nome":"BOIA CAIXA-DAGUA 1/2 PLAST. KRONA","categoria":"Hidráulica & Conexões","especie":"PVC / Metal","tipo_calculo":"UN","unidade_medida":"UN","preco_unitario":11.5,"taxa_plaina_padrao":0,"estoque_atual":70,"estoque_minimo":20,"ativo":true},
  {"id":"prod_94","codigo":"1-071","nome":"BOIA ELETRICA DE NIVEL 25A","categoria":"Hidráulica & Conexões","especie":"PVC / Metal","tipo_calculo":"UN","unidade_medida":"UN","preco_unitario":67.5,"taxa_plaina_padrao":0,"estoque_atual":70,"estoque_minimo":20,"ativo":true},
  {"id":"prod_95","codigo":"MAT-095","nome":"BOMBA MANUAL VERTICAL METALICA","categoria":"Ferramentas & Acessórios","especie":"Aço / Ferramental","tipo_calculo":"UN","unidade_medida":"UN","preco_unitario":41.5,"taxa_plaina_padrao":0,"estoque_atual":25,"estoque_minimo":5,"ativo":true},
  {"id":"prod_96","codigo":"1-073","nome":"BOTA BORRACHA ( 38,39, 40, 41, 42 e 43)","categoria":"EPIs, Cordas & Diversos","especie":"Diversos","tipo_calculo":"UN","unidade_medida":"UN","preco_unitario":55.35,"taxa_plaina_padrao":0,"estoque_atual":40,"estoque_minimo":10,"ativo":true},
  {"id":"prod_97","codigo":"MAT-097","nome":"BOTA DE BORRACHA PEGA FORTE (Nº 38,39, 40, 41, 42 e 43)","categoria":"EPIs, Cordas & Diversos","especie":"Diversos","tipo_calculo":"UN","unidade_medida":"UN","preco_unitario":49.5,"taxa_plaina_padrao":0,"estoque_atual":40,"estoque_minimo":10,"ativo":true},
  {"id":"prod_98","codigo":"1-074","nome":"BOTINAS BICO PVC ( 38, 39, 40, 41, 42, 43)","categoria":"EPIs, Cordas & Diversos","especie":"PVC","tipo_calculo":"UN","unidade_medida":"UN","preco_unitario":55.5,"taxa_plaina_padrao":0,"estoque_atual":40,"estoque_minimo":10,"ativo":true},
  {"id":"prod_99","codigo":"MAT-099","nome":"BOTINAS COURO BICO PVC (Nº 38, 39, 40, 41, 42 e 43)","categoria":"EPIs, Cordas & Diversos","especie":"PVC","tipo_calculo":"UN","unidade_medida":"UN","preco_unitario":68,"taxa_plaina_padrao":0,"estoque_atual":40,"estoque_minimo":10,"ativo":true},
  {"id":"prod_100","codigo":"1-075","nome":"BRAÇO P/CHUVEIRO 40 CM 1/2 BOGNAR","categoria":"Hidráulica & Conexões","especie":"Aço","tipo_calculo":"UN","unidade_medida":"UN","preco_unitario":14.5,"taxa_plaina_padrao":0,"estoque_atual":70,"estoque_minimo":20,"ativo":true},
  {"id":"prod_101","codigo":"1-076","nome":"BROCA AÇO RAPIDO 3 MM IRWIN (UM)","categoria":"Ferramentas & Acessórios","especie":"Aço","tipo_calculo":"UN","unidade_medida":"UN","preco_unitario":3,"taxa_plaina_padrao":0,"estoque_atual":25,"estoque_minimo":5,"ativo":true},
  {"id":"prod_102","codigo":"1-077","nome":"BROCA AÇO RAPIDO 4 MM IRWIN (UM)","categoria":"Ferramentas & Acessórios","especie":"Aço","tipo_calculo":"UN","unidade_medida":"UN","preco_unitario":4.5,"taxa_plaina_padrao":0,"estoque_atual":25,"estoque_minimo":5,"ativo":true},
  {"id":"prod_103","codigo":"1-078","nome":"BROCA AÇO RAPIDO 5 MM GCORTE (UM)","categoria":"Ferramentas & Acessórios","especie":"Aço","tipo_calculo":"UN","unidade_medida":"UN","preco_unitario":5.5,"taxa_plaina_padrao":0,"estoque_atual":25,"estoque_minimo":5,"ativo":true},
  {"id":"prod_104","codigo":"1-079","nome":"BROCA AÇO RAPIDO 6 MM IRWIN (UM)","categoria":"Ferramentas & Acessórios","especie":"Aço","tipo_calculo":"UN","unidade_medida":"UN","preco_unitario":7.6,"taxa_plaina_padrao":0,"estoque_atual":25,"estoque_minimo":5,"ativo":true},
  {"id":"prod_105","codigo":"1-080","nome":"BROCA CHATA 1\"","categoria":"Ferramentas & Acessórios","especie":"Aço / Ferramental","tipo_calculo":"UN","unidade_medida":"UN","preco_unitario":13,"taxa_plaina_padrao":0,"estoque_atual":25,"estoque_minimo":5,"ativo":true},
  {"id":"prod_106","codigo":"1-081","nome":"BROCA CHATA 1/2","categoria":"Ferramentas & Acessórios","especie":"Aço / Ferramental","tipo_calculo":"UN","unidade_medida":"UN","preco_unitario":9.6,"taxa_plaina_padrao":0,"estoque_atual":25,"estoque_minimo":5,"ativo":true},
  {"id":"prod_107","codigo":"MAT-107","nome":"BROCA CHATA 1/4","categoria":"Ferramentas & Acessórios","especie":"Aço / Ferramental","tipo_calculo":"UN","unidade_medida":"UN","preco_unitario":9.6,"taxa_plaina_padrao":0,"estoque_atual":25,"estoque_minimo":5,"ativo":true},
  {"id":"prod_108","codigo":"1-082","nome":"BROCA CHATA 3/4","categoria":"Ferramentas & Acessórios","especie":"Aço / Ferramental","tipo_calculo":"UN","unidade_medida":"UN","preco_unitario":10,"taxa_plaina_padrao":0,"estoque_atual":25,"estoque_minimo":5,"ativo":true},
  {"id":"prod_109","codigo":"1-083","nome":"BROCA CHATA 3/8","categoria":"Ferramentas & Acessórios","especie":"Aço / Ferramental","tipo_calculo":"UN","unidade_medida":"UN","preco_unitario":9.2,"taxa_plaina_padrao":0,"estoque_atual":25,"estoque_minimo":5,"ativo":true},
  {"id":"prod_110","codigo":"1-084","nome":"BROCA CHATA 5/16","categoria":"Ferramentas & Acessórios","especie":"Aço / Ferramental","tipo_calculo":"UN","unidade_medida":"UN","preco_unitario":8.4,"taxa_plaina_padrao":0,"estoque_atual":25,"estoque_minimo":5,"ativo":true},
  {"id":"prod_111","codigo":"1-085","nome":"BROCA CHATA 5/8","categoria":"Ferramentas & Acessórios","especie":"Aço / Ferramental","tipo_calculo":"UN","unidade_medida":"UN","preco_unitario":11,"taxa_plaina_padrao":0,"estoque_atual":25,"estoque_minimo":5,"ativo":true},
  {"id":"prod_112","codigo":"1-086","nome":"BROCA ESCALONADA PARA METAL  4 A 20MM (MTX)","categoria":"Ferramentas & Acessórios","especie":"Aço / Ferramental","tipo_calculo":"UN","unidade_medida":"UN","preco_unitario":45,"taxa_plaina_padrao":0,"estoque_atual":25,"estoque_minimo":5,"ativo":true},
  {"id":"prod_113","codigo":"1-087","nome":"BROCA MADEIRA GCORTE (UM) 3MM","categoria":"Ferramentas & Acessórios","especie":"Aço / Ferramental","tipo_calculo":"UN","unidade_medida":"UN","preco_unitario":2,"taxa_plaina_padrao":0,"estoque_atual":25,"estoque_minimo":5,"ativo":true},
  {"id":"prod_114","codigo":"1-088","nome":"BROCA MADEIRA GCORTE (UM) 5MM","categoria":"Ferramentas & Acessórios","especie":"Aço / Ferramental","tipo_calculo":"UN","unidade_medida":"UN","preco_unitario":2.8,"taxa_plaina_padrao":0,"estoque_atual":25,"estoque_minimo":5,"ativo":true},
  {"id":"prod_115","codigo":"1-089","nome":"BROCA MADEIRA GCORTE (UN) 10MM","categoria":"Ferramentas & Acessórios","especie":"Aço / Ferramental","tipo_calculo":"UN","unidade_medida":"UN","preco_unitario":7,"taxa_plaina_padrao":0,"estoque_atual":25,"estoque_minimo":5,"ativo":true},
  {"id":"prod_116","codigo":"1-090","nome":"BROCA MADEIRA GCORTE (UN) 6 MM","categoria":"Ferramentas & Acessórios","especie":"Aço / Ferramental","tipo_calculo":"UN","unidade_medida":"UN","preco_unitario":3.4,"taxa_plaina_padrao":0,"estoque_atual":25,"estoque_minimo":5,"ativo":true},
  {"id":"prod_117","codigo":"1-091","nome":"BROCA MADEIRA GCORTE (UN) 8 MM","categoria":"Ferramentas & Acessórios","especie":"Aço / Ferramental","tipo_calculo":"UN","unidade_medida":"UN","preco_unitario":4.8,"taxa_plaina_padrao":0,"estoque_atual":25,"estoque_minimo":5,"ativo":true},
  {"id":"prod_118","codigo":"1-092","nome":"BROCA MOURÃO 1/4\" 250MM","categoria":"Ferramentas & Acessórios","especie":"Aço / Ferramental","tipo_calculo":"UN","unidade_medida":"UN","preco_unitario":12.3,"taxa_plaina_padrao":0,"estoque_atual":25,"estoque_minimo":5,"ativo":true},
  {"id":"prod_119","codigo":"1-093","nome":"BROCA MOURÃO 3/18\" X 320 MM","categoria":"Ferramentas & Acessórios","especie":"Aço / Ferramental","tipo_calculo":"UN","unidade_medida":"UN","preco_unitario":26.1,"taxa_plaina_padrao":0,"estoque_atual":25,"estoque_minimo":5,"ativo":true},
  {"id":"prod_120","codigo":"1-094","nome":"BROCA MOURÃO 5/16\" X 280 MM","categoria":"Ferramentas & Acessórios","especie":"Aço / Ferramental","tipo_calculo":"UN","unidade_medida":"UN","preco_unitario":21.6,"taxa_plaina_padrao":0,"estoque_atual":25,"estoque_minimo":5,"ativo":true},
  {"id":"prod_121","codigo":"1-095","nome":"BROCA VIDEA CONCRETO 10MM","categoria":"Ferramentas & Acessórios","especie":"Concreto","tipo_calculo":"UN","unidade_medida":"UN","preco_unitario":17.7,"taxa_plaina_padrao":0,"estoque_atual":25,"estoque_minimo":5,"ativo":true},
  {"id":"prod_122","codigo":"1-096","nome":"BROCA VIDEA CONCRETO 12MM","categoria":"Ferramentas & Acessórios","especie":"Concreto","tipo_calculo":"UN","unidade_medida":"UN","preco_unitario":24,"taxa_plaina_padrao":0,"estoque_atual":25,"estoque_minimo":5,"ativo":true},
  {"id":"prod_123","codigo":"1-097","nome":"BROCA WIDEA 10 MM","categoria":"Ferramentas & Acessórios","especie":"Aço / Ferramental","tipo_calculo":"UN","unidade_medida":"UN","preco_unitario":7.2,"taxa_plaina_padrao":0,"estoque_atual":25,"estoque_minimo":5,"ativo":true},
  {"id":"prod_124","codigo":"1-098","nome":"BROCA WIDEA 6 MM","categoria":"Ferramentas & Acessórios","especie":"Aço / Ferramental","tipo_calculo":"UN","unidade_medida":"UN","preco_unitario":5,"taxa_plaina_padrao":0,"estoque_atual":25,"estoque_minimo":5,"ativo":true},
  {"id":"prod_125","codigo":"1-099","nome":"BROCA WIDEA 8 MM","categoria":"Ferramentas & Acessórios","especie":"Aço / Ferramental","tipo_calculo":"UN","unidade_medida":"UN","preco_unitario":7.5,"taxa_plaina_padrao":0,"estoque_atual":25,"estoque_minimo":5,"ativo":true},
  {"id":"prod_126","codigo":"1-100","nome":"BROXA RETANGULAR ROMA","categoria":"Ferramentas & Acessórios","especie":"Aço / Ferramental","tipo_calculo":"UN","unidade_medida":"UN","preco_unitario":7,"taxa_plaina_padrao":0,"estoque_atual":25,"estoque_minimo":5,"ativo":true},
  {"id":"prod_127","codigo":"1-101","nome":"BUCHA FIXAÇÃO 06 IV PLAST E 08 IV PLAST","categoria":"Fixação & Pregos","especie":"Aço","tipo_calculo":"UN","unidade_medida":"UN","preco_unitario":0.2,"taxa_plaina_padrao":0,"estoque_atual":120,"estoque_minimo":30,"ativo":true},
  {"id":"prod_128","codigo":"1-102","nome":"BUCHA FIXAÇÃO 10 IV PLAST E 12 IV PLSST","categoria":"Fixação & Pregos","especie":"Aço","tipo_calculo":"UN","unidade_medida":"UN","preco_unitario":0.3,"taxa_plaina_padrao":0,"estoque_atual":120,"estoque_minimo":30,"ativo":true},
  {"id":"prod_129","codigo":"1-103","nome":"BUCHA RED 1.X3/4","categoria":"Fixação & Pregos","especie":"Aço","tipo_calculo":"UN","unidade_medida":"UN","preco_unitario":3.8,"taxa_plaina_padrao":0,"estoque_atual":120,"estoque_minimo":30,"ativo":true},
  {"id":"prod_130","codigo":"1-104","nome":"BUCHA RED SOLD CURTA 25X20 MM","categoria":"Fixação & Pregos","especie":"Aço","tipo_calculo":"UN","unidade_medida":"UN","preco_unitario":0.5,"taxa_plaina_padrao":0,"estoque_atual":120,"estoque_minimo":30,"ativo":true},
  {"id":"prod_131","codigo":"1-105","nome":"BUCHA RED SOLD LONGA 50X25 MM PLASTUBOS","categoria":"Fixação & Pregos","especie":"Aço","tipo_calculo":"UN","unidade_medida":"UN","preco_unitario":3.8,"taxa_plaina_padrao":0,"estoque_atual":120,"estoque_minimo":30,"ativo":true},
  {"id":"prod_132","codigo":"MAT-132","nome":"CABO CAIPIRA","categoria":"Ferramentas & Acessórios","especie":"Aço / Ferramental","tipo_calculo":"UN","unidade_medida":"UN","preco_unitario":19.8,"taxa_plaina_padrao":0,"estoque_atual":25,"estoque_minimo":5,"ativo":true},
  {"id":"prod_133","codigo":"MAT-133","nome":"CABO FLEXIVEL 1,5MM C/ 100 M","categoria":"Elétrica & Iluminação","especie":"Cobre / Termoplástico","tipo_calculo":"UN","unidade_medida":"UN","preco_unitario":144,"taxa_plaina_padrao":0,"estoque_atual":55,"estoque_minimo":15,"ativo":true},
  {"id":"prod_134","codigo":"1-107","nome":"CABO FLEXIVEL 10,0MM C/ 100 MT","categoria":"Elétrica & Iluminação","especie":"Cobre / Termoplástico","tipo_calculo":"UN","unidade_medida":"UN","preco_unitario":838.6,"taxa_plaina_padrao":0,"estoque_atual":55,"estoque_minimo":15,"ativo":true},
  {"id":"prod_135","codigo":"1-108","nome":"CABO FLEXIVEL 16,0MM C/ 100 MT","categoria":"Elétrica & Iluminação","especie":"Cobre / Termoplástico","tipo_calculo":"UN","unidade_medida":"UN","preco_unitario":1281,"taxa_plaina_padrao":0,"estoque_atual":55,"estoque_minimo":15,"ativo":true},
  {"id":"prod_136","codigo":"MAT-136","nome":"CABO FLEXIVEL 2,5MM C/ 100M","categoria":"Elétrica & Iluminação","especie":"Cobre / Termoplástico","tipo_calculo":"UN","unidade_medida":"UN","preco_unitario":232,"taxa_plaina_padrao":0,"estoque_atual":55,"estoque_minimo":15,"ativo":true},
  {"id":"prod_137","codigo":"MAT-137","nome":"CABO FLEXIVEL 4,0MM C/ 100 MT","categoria":"Elétrica & Iluminação","especie":"Cobre / Termoplástico","tipo_calculo":"UN","unidade_medida":"UN","preco_unitario":321.5,"taxa_plaina_padrao":0,"estoque_atual":55,"estoque_minimo":15,"ativo":true},
  {"id":"prod_138","codigo":"MAT-138","nome":"CABO FLEXIVEL 6,0MM C/ 100M","categoria":"Elétrica & Iluminação","especie":"Cobre / Termoplástico","tipo_calculo":"UN","unidade_medida":"UN","preco_unitario":548.5,"taxa_plaina_padrao":0,"estoque_atual":55,"estoque_minimo":15,"ativo":true},
  {"id":"prod_139","codigo":"MAT-139","nome":"CABO MARTELO","categoria":"Ferramentas & Acessórios","especie":"Aço / Ferramental","tipo_calculo":"UN","unidade_medida":"UN","preco_unitario":8.4,"taxa_plaina_padrao":0,"estoque_atual":25,"estoque_minimo":5,"ativo":true},
  {"id":"prod_140","codigo":"MAT-140","nome":"CABO P/ ENCHADA CAIPIRA 1,60 E TORNEADO","categoria":"Ferramentas & Acessórios","especie":"Aço / Ferramental","tipo_calculo":"UN","unidade_medida":"UN","preco_unitario":21.2,"taxa_plaina_padrao":0,"estoque_atual":25,"estoque_minimo":5,"ativo":true},
  {"id":"prod_141","codigo":"MAT-141","nome":"CABO TORNEADO","categoria":"Ferramentas & Acessórios","especie":"Aço / Ferramental","tipo_calculo":"UN","unidade_medida":"UN","preco_unitario":23.4,"taxa_plaina_padrao":0,"estoque_atual":25,"estoque_minimo":5,"ativo":true},
  {"id":"prod_142","codigo":"MAT-142","nome":"CABO VASSOURA C/ROSCA","categoria":"Ferramentas & Acessórios","especie":"Aço / Ferramental","tipo_calculo":"UN","unidade_medida":"UN","preco_unitario":9,"taxa_plaina_padrao":0,"estoque_atual":25,"estoque_minimo":5,"ativo":true},
  {"id":"prod_143","codigo":"MAT-143","nome":"CADEADO 25 MM 3F","categoria":"Ferragens & Cercas","especie":"Aço Galvanizado","tipo_calculo":"UN","unidade_medida":"UN","preco_unitario":17,"taxa_plaina_padrao":0,"estoque_atual":45,"estoque_minimo":10,"ativo":true},
  {"id":"prod_144","codigo":"1-114","nome":"CADEADO 30 MM PAPAIZ PÇ","categoria":"Ferragens & Cercas","especie":"Aço Galvanizado","tipo_calculo":"UN","unidade_medida":"UN","preco_unitario":22.4,"taxa_plaina_padrao":0,"estoque_atual":45,"estoque_minimo":10,"ativo":true},
  {"id":"prod_145","codigo":"MAT-145","nome":"CADEADO 35 MM 3F","categoria":"Ferragens & Cercas","especie":"Aço Galvanizado","tipo_calculo":"UN","unidade_medida":"UN","preco_unitario":24,"taxa_plaina_padrao":0,"estoque_atual":45,"estoque_minimo":10,"ativo":true},
  {"id":"prod_146","codigo":"1-116","nome":"CADEADO 40 MM PAPAIZ PÇ","categoria":"Ferragens & Cercas","especie":"Aço Galvanizado","tipo_calculo":"UN","unidade_medida":"UN","preco_unitario":36.5,"taxa_plaina_padrao":0,"estoque_atual":45,"estoque_minimo":10,"ativo":true},
  {"id":"prod_147","codigo":"1-119","nome":"CAIXA  DE DESCARGA 6/9 L CINZA ALUMASA","categoria":"Hidráulica & Conexões","especie":"PVC / Metal","tipo_calculo":"UN","unidade_medida":"UN","preco_unitario":43.5,"taxa_plaina_padrao":0,"estoque_atual":70,"estoque_minimo":20,"ativo":true},
  {"id":"prod_148","codigo":"1-120","nome":"CAIXA ACOPLADA BRANCO SIMP 6L  ARAXA STA CLARA","categoria":"Utilidades Gerais","especie":"Aço","tipo_calculo":"UN","unidade_medida":"UN","preco_unitario":215.5,"taxa_plaina_padrao":0,"estoque_atual":40,"estoque_minimo":10,"ativo":true},
  {"id":"prod_149","codigo":"1-121","nome":"CAIXA D' AGUA 1000 L C/ TAMPA FORTLEV","categoria":"Hidráulica & Conexões","especie":"PVC / Metal","tipo_calculo":"UN","unidade_medida":"UN","preco_unitario":690.5,"taxa_plaina_padrao":0,"estoque_atual":70,"estoque_minimo":20,"ativo":true},
  {"id":"prod_150","codigo":"1-122","nome":"CAIXA D' AGUA 310 L C/TAMPA FORTLEV","categoria":"Hidráulica & Conexões","especie":"PVC / Metal","tipo_calculo":"UN","unidade_medida":"UN","preco_unitario":392,"taxa_plaina_padrao":0,"estoque_atual":70,"estoque_minimo":20,"ativo":true},
  {"id":"prod_151","codigo":"1-123","nome":"CAIXA D' AGUA 500 L C/TAMPA FORTLEV","categoria":"Hidráulica & Conexões","especie":"PVC / Metal","tipo_calculo":"UN","unidade_medida":"UN","preco_unitario":425,"taxa_plaina_padrao":0,"estoque_atual":70,"estoque_minimo":20,"ativo":true},
  {"id":"prod_152","codigo":"1-124","nome":"CAIXA DE DESCARGA 6/9 L AREIA OU BRANCA LUMASA","categoria":"Hidráulica & Conexões","especie":"PVC / Metal","tipo_calculo":"UN","unidade_medida":"UN","preco_unitario":43.5,"taxa_plaina_padrao":0,"estoque_atual":70,"estoque_minimo":20,"ativo":true},
  {"id":"prod_153","codigo":"1-125","nome":"CAIXA DE MASSA 20 L PRETA ZUMPLAST","categoria":"Construção & Alvenaria","especie":"Diversos","tipo_calculo":"UN","unidade_medida":"UN","preco_unitario":14.5,"taxa_plaina_padrao":0,"estoque_atual":8,"estoque_minimo":2,"ativo":true},
  {"id":"prod_154","codigo":"1-126","nome":"CAIXA DE MASSA 40 L PRETA ZUMPLAST","categoria":"Construção & Alvenaria","especie":"Diversos","tipo_calculo":"UN","unidade_medida":"UN","preco_unitario":34,"taxa_plaina_padrao":0,"estoque_atual":8,"estoque_minimo":2,"ativo":true},
  {"id":"prod_155","codigo":"MAT-155","nome":"CAIXA LUZ 4X2 AMARELA","categoria":"Elétrica & Iluminação","especie":"Cobre / Termoplástico","tipo_calculo":"UN","unidade_medida":"UN","preco_unitario":1.6,"taxa_plaina_padrao":0,"estoque_atual":55,"estoque_minimo":15,"ativo":true},
  {"id":"prod_156","codigo":"1-127","nome":"CAIXA LUZ 4X2 CORES","categoria":"Elétrica & Iluminação","especie":"Cobre / Termoplástico","tipo_calculo":"UN","unidade_medida":"UN","preco_unitario":1.8,"taxa_plaina_padrao":0,"estoque_atual":55,"estoque_minimo":15,"ativo":true},
  {"id":"prod_157","codigo":"MAT-157","nome":"CAIXA LUZ 4X4 CORES","categoria":"Elétrica & Iluminação","especie":"Cobre / Termoplástico","tipo_calculo":"UN","unidade_medida":"UN","preco_unitario":2.1,"taxa_plaina_padrao":0,"estoque_atual":55,"estoque_minimo":15,"ativo":true},
  {"id":"prod_158","codigo":"1-128","nome":"CAIXA SIFONADA QUADRADA RALO 100X100","categoria":"Hidráulica & Conexões","especie":"PVC / Metal","tipo_calculo":"UN","unidade_medida":"UN","preco_unitario":13.4,"taxa_plaina_padrao":0,"estoque_atual":70,"estoque_minimo":20,"ativo":true},
  {"id":"prod_159","codigo":"1-129","nome":"CAIXINHA LUZ P/ LAJE 4X4 PLASTUBOS","categoria":"Elétrica & Iluminação","especie":"Cobre / Termoplástico","tipo_calculo":"UN","unidade_medida":"UN","preco_unitario":21,"taxa_plaina_padrao":0,"estoque_atual":55,"estoque_minimo":15,"ativo":true},
  {"id":"prod_160","codigo":"1-130","nome":"CAMERA AR CARRINHO DE MÃO 3.25/8","categoria":"Ferramentas & Acessórios","especie":"Aço / Ferramental","tipo_calculo":"UN","unidade_medida":"UN","preco_unitario":18.2,"taxa_plaina_padrao":0,"estoque_atual":25,"estoque_minimo":5,"ativo":true},
  {"id":"prod_161","codigo":"MAT-161","nome":"CAMERA AR DE CARRINHO DE MÃO 3.25/8","categoria":"Ferramentas & Acessórios","especie":"Aço / Ferramental","tipo_calculo":"UN","unidade_medida":"UN","preco_unitario":21,"taxa_plaina_padrao":0,"estoque_atual":25,"estoque_minimo":5,"ativo":true},
  {"id":"prod_162","codigo":"1-131","nome":"CANDUITE AMARELO 1/2 X 50M","categoria":"Elétrica & Iluminação","especie":"Cobre / Termoplástico","tipo_calculo":"UN","unidade_medida":"UN","preco_unitario":2,"taxa_plaina_padrao":0,"estoque_atual":55,"estoque_minimo":15,"ativo":true},
  {"id":"prod_163","codigo":"MAT-163","nome":"CANDUITE AMARELO 1/2 X 50M FORTELEV","categoria":"Elétrica & Iluminação","especie":"Cobre / Termoplástico","tipo_calculo":"UN","unidade_medida":"UN","preco_unitario":2,"taxa_plaina_padrao":0,"estoque_atual":55,"estoque_minimo":15,"ativo":true},
  {"id":"prod_164","codigo":"1-132","nome":"CANDUITE AMARELO 3/4 X 50M","categoria":"Elétrica & Iluminação","especie":"Cobre / Termoplástico","tipo_calculo":"UN","unidade_medida":"UN","preco_unitario":129,"taxa_plaina_padrao":0,"estoque_atual":55,"estoque_minimo":15,"ativo":true},
  {"id":"prod_165","codigo":"MAT-165","nome":"CANDUITE CINZA 3/4 X 50M BRAVO","categoria":"Elétrica & Iluminação","especie":"Cobre / Termoplástico","tipo_calculo":"UN","unidade_medida":"UN","preco_unitario":2.8,"taxa_plaina_padrao":0,"estoque_atual":55,"estoque_minimo":15,"ativo":true},
  {"id":"prod_166","codigo":"MAT-166","nome":"CANO AGUA KRONA MARROM 25MM","categoria":"Hidráulica & Conexões","especie":"PVC / Metal","tipo_calculo":"UN","unidade_medida":"UN","preco_unitario":29.96,"taxa_plaina_padrao":0,"estoque_atual":70,"estoque_minimo":20,"ativo":true},
  {"id":"prod_167","codigo":"MAT-167","nome":"CANO AGUA KRONA MARROM 32MM","categoria":"Hidráulica & Conexões","especie":"PVC / Metal","tipo_calculo":"UN","unidade_medida":"UN","preco_unitario":71.4,"taxa_plaina_padrao":0,"estoque_atual":70,"estoque_minimo":20,"ativo":true},
  {"id":"prod_168","codigo":"MAT-168","nome":"CANO AGUA KRONA MARROM 40MM","categoria":"Hidráulica & Conexões","especie":"PVC / Metal","tipo_calculo":"UN","unidade_medida":"UN","preco_unitario":118.44,"taxa_plaina_padrao":0,"estoque_atual":70,"estoque_minimo":20,"ativo":true},
  {"id":"prod_169","codigo":"MAT-169","nome":"CANO AGUA KRONA MARROM 50MM","categoria":"Hidráulica & Conexões","especie":"PVC / Metal","tipo_calculo":"UN","unidade_medida":"UN","preco_unitario":114.8,"taxa_plaina_padrao":0,"estoque_atual":70,"estoque_minimo":20,"ativo":true},
  {"id":"prod_170","codigo":"MAT-170","nome":"CANO ESG. KRONA 100MM","categoria":"Hidráulica & Conexões","especie":"PVC / Metal","tipo_calculo":"UN","unidade_medida":"UN","preco_unitario":120.12,"taxa_plaina_padrao":0,"estoque_atual":70,"estoque_minimo":20,"ativo":true},
  {"id":"prod_171","codigo":"MAT-171","nome":"CANO ESG. KRONA 40MM","categoria":"Hidráulica & Conexões","especie":"PVC / Metal","tipo_calculo":"UN","unidade_medida":"UN","preco_unitario":46.76,"taxa_plaina_padrao":0,"estoque_atual":70,"estoque_minimo":20,"ativo":true},
  {"id":"prod_172","codigo":"MAT-172","nome":"CANO ESG. KRONA 50MM","categoria":"Hidráulica & Conexões","especie":"PVC / Metal","tipo_calculo":"UN","unidade_medida":"UN","preco_unitario":78.12,"taxa_plaina_padrao":0,"estoque_atual":70,"estoque_minimo":20,"ativo":true},
  {"id":"prod_173","codigo":"MAT-173","nome":"CANO ESG. KRONA 75MM","categoria":"Hidráulica & Conexões","especie":"PVC / Metal","tipo_calculo":"UN","unidade_medida":"UN","preco_unitario":116.76,"taxa_plaina_padrao":0,"estoque_atual":0,"estoque_minimo":10,"ativo":true},
  {"id":"prod_174","codigo":"1-133","nome":"CANTO ACABAMENTO DE FORRO PVC BRANCO GELO ( O METRO )","categoria":"Forros & Acabamentos","especie":"PVC","tipo_calculo":"ML","unidade_medida":"ML","preco_unitario":2.3,"taxa_plaina_padrao":0,"estoque_atual":40,"estoque_minimo":10,"ativo":true,"comprimentos_comuns":[2.5,3,3.5,4]},
  {"id":"prod_175","codigo":"1-134","nome":"CANTONHEIRA PVC BRANCO GELO BARRA 6 MTs","categoria":"Forros & Acabamentos","especie":"PVC","tipo_calculo":"UN","unidade_medida":"UN","preco_unitario":50.4,"taxa_plaina_padrao":0,"estoque_atual":40,"estoque_minimo":10,"ativo":true},
  {"id":"prod_176","codigo":"1-135","nome":"CAPA DE CHUVA C/MANGA AMARELA G 1,10M","categoria":"EPIs, Cordas & Diversos","especie":"Diversos","tipo_calculo":"UN","unidade_medida":"UN","preco_unitario":24.8,"taxa_plaina_padrao":0,"estoque_atual":40,"estoque_minimo":10,"ativo":true},
  {"id":"prod_177","codigo":"1-136","nome":"CARRETEL AUT BATE E LIBERA TOYAMA M12X150 - FLH P/ STIHL FS160/220","categoria":"Ferramentas & Acessórios","especie":"Aço / Ferramental","tipo_calculo":"UN","unidade_medida":"UN","preco_unitario":87,"taxa_plaina_padrao":0,"estoque_atual":25,"estoque_minimo":5,"ativo":true},
  {"id":"prod_178","codigo":"1-137","nome":"CARRINHO CONSTRUÇÃO VERMELHO GORDINI / MAXTER","categoria":"Ferramentas & Acessórios","especie":"Aço / Ferramental","tipo_calculo":"UN","unidade_medida":"UN","preco_unitario":242,"taxa_plaina_padrao":0,"estoque_atual":25,"estoque_minimo":5,"ativo":true},
  {"id":"prod_179","codigo":"1-138","nome":"CAVADEIRA ART CABO MADEIRA 1,50 M","categoria":"Ferramentas & Acessórios","especie":"Aço / Ferramental","tipo_calculo":"UN","unidade_medida":"UN","preco_unitario":93,"taxa_plaina_padrao":0,"estoque_atual":25,"estoque_minimo":5,"ativo":true},
  {"id":"prod_180","codigo":"1-139","nome":"CAVADEIRA ART CABO MADEIRA 1,80 M","categoria":"Ferramentas & Acessórios","especie":"Aço / Ferramental","tipo_calculo":"UN","unidade_medida":"UN","preco_unitario":110,"taxa_plaina_padrao":0,"estoque_atual":25,"estoque_minimo":5,"ativo":true},
  {"id":"prod_181","codigo":"MAT-181","nome":"CAVADEIRA ART MADEIRA 1,40 M MAX C2","categoria":"Ferramentas & Acessórios","especie":"Aço / Ferramental","tipo_calculo":"UN","unidade_medida":"UN","preco_unitario":93,"taxa_plaina_padrao":0,"estoque_atual":25,"estoque_minimo":5,"ativo":true},
  {"id":"prod_182","codigo":"MAT-182","nome":"CAVADEIRA ART.LIGHT MAXFER  CABO MADEIRA 1,80 M","categoria":"Ferramentas & Acessórios","especie":"Aço / Ferramental","tipo_calculo":"UN","unidade_medida":"UN","preco_unitario":110,"taxa_plaina_padrao":0,"estoque_atual":25,"estoque_minimo":5,"ativo":true},
  {"id":"prod_183","codigo":"1-140","nome":"CAVADEIRA RETA C/CB 1,40M  MOMFORT","categoria":"Ferramentas & Acessórios","especie":"Aço / Ferramental","tipo_calculo":"UN","unidade_medida":"UN","preco_unitario":49,"taxa_plaina_padrao":0,"estoque_atual":25,"estoque_minimo":5,"ativo":true},
  {"id":"prod_184","codigo":"MAT-184","nome":"CAVADEIRA RETA S/CB TRAMONTINA","categoria":"Ferramentas & Acessórios","especie":"Aço / Ferramental","tipo_calculo":"UN","unidade_medida":"UN","preco_unitario":30.8,"taxa_plaina_padrao":0,"estoque_atual":25,"estoque_minimo":5,"ativo":true},
  {"id":"prod_185","codigo":"1-141","nome":"CAVADEIRA TRADO 8* MINASUL","categoria":"Ferramentas & Acessórios","especie":"Aço / Ferramental","tipo_calculo":"UN","unidade_medida":"UN","preco_unitario":88,"taxa_plaina_padrao":0,"estoque_atual":25,"estoque_minimo":5,"ativo":true},
  {"id":"prod_186","codigo":"MAT-186","nome":"CHAPA MINEIRA 3 FUROS C/ TAMPA 61X22X28 PÇ","categoria":"Construção & Alvenaria","especie":"Diversos","tipo_calculo":"UN","unidade_medida":"UN","preco_unitario":51,"taxa_plaina_padrao":0,"estoque_atual":8,"estoque_minimo":2,"ativo":true},
  {"id":"prod_187","codigo":"MAT-187","nome":"CHAPA MINEIRA 3 FUROS C/ TAMPA E REDUÇÃO 73X28X34 PÇ","categoria":"Construção & Alvenaria","especie":"Diversos","tipo_calculo":"UN","unidade_medida":"UN","preco_unitario":96,"taxa_plaina_padrao":0,"estoque_atual":8,"estoque_minimo":2,"ativo":true},
  {"id":"prod_188","codigo":"MAT-188","nome":"CHAPA MINEIRA 4 FUROS C/ TAMPA 83X25X28 PÇ","categoria":"Construção & Alvenaria","especie":"Diversos","tipo_calculo":"UN","unidade_medida":"UN","preco_unitario":88,"taxa_plaina_padrao":0,"estoque_atual":8,"estoque_minimo":2,"ativo":true},
  {"id":"prod_189","codigo":"MAT-189","nome":"CHAPA MINEIRA 4 FUROS C/ TAMPA E REDUÇÃO 99X29X35 PÇ","categoria":"Construção & Alvenaria","especie":"Diversos","tipo_calculo":"UN","unidade_medida":"UN","preco_unitario":136,"taxa_plaina_padrao":0,"estoque_atual":8,"estoque_minimo":2,"ativo":true},
  {"id":"prod_190","codigo":"1-142","nome":"CHAPA PAULISTA 3 FUROS C/ TAMPA 57X19X24","categoria":"Construção & Alvenaria","especie":"Diversos","tipo_calculo":"UN","unidade_medida":"UN","preco_unitario":87,"taxa_plaina_padrao":0,"estoque_atual":8,"estoque_minimo":2,"ativo":true},
  {"id":"prod_191","codigo":"MAT-191","nome":"CHAPEU C/ SAIA","categoria":"Utilidades Gerais","especie":"Diversos","tipo_calculo":"UN","unidade_medida":"UN","preco_unitario":21,"taxa_plaina_padrao":0,"estoque_atual":40,"estoque_minimo":10,"ativo":true},
  {"id":"prod_192","codigo":"MAT-192","nome":"CHAPEU GIGANTINHO SIMPLES","categoria":"Utilidades Gerais","especie":"Diversos","tipo_calculo":"UN","unidade_medida":"UN","preco_unitario":20,"taxa_plaina_padrao":0,"estoque_atual":40,"estoque_minimo":10,"ativo":true},
  {"id":"prod_193","codigo":"MAT-193","nome":"CHAPEU JANGADEIRO TREMENDÃO","categoria":"Utilidades Gerais","especie":"Diversos","tipo_calculo":"UN","unidade_medida":"UN","preco_unitario":19,"taxa_plaina_padrao":0,"estoque_atual":40,"estoque_minimo":10,"ativo":true},
  {"id":"prod_194","codigo":"MAT-194","nome":"CHAPEU PANTANEIRO","categoria":"Utilidades Gerais","especie":"Diversos","tipo_calculo":"UN","unidade_medida":"UN","preco_unitario":24,"taxa_plaina_padrao":0,"estoque_atual":40,"estoque_minimo":10,"ativo":true},
  {"id":"prod_195","codigo":"MAT-195","nome":"CHAPEU PANTANEIRO PANAMA","categoria":"Utilidades Gerais","especie":"Diversos","tipo_calculo":"UN","unidade_medida":"UN","preco_unitario":30,"taxa_plaina_padrao":0,"estoque_atual":40,"estoque_minimo":10,"ativo":true},
  {"id":"prod_196","codigo":"1-161","nome":"CHAVE ALLEM 1,5 A 10 MM THOMPSON","categoria":"Ferramentas & Acessórios","especie":"Aço / Ferramental","tipo_calculo":"UN","unidade_medida":"UN","preco_unitario":15.3,"taxa_plaina_padrao":0,"estoque_atual":25,"estoque_minimo":5,"ativo":true},
  {"id":"prod_197","codigo":"1-160","nome":"CHAVE ALLEM 1,5 A 6 MM THOMPSON","categoria":"Ferramentas & Acessórios","especie":"Aço / Ferramental","tipo_calculo":"UN","unidade_medida":"UN","preco_unitario":9.6,"taxa_plaina_padrao":0,"estoque_atual":25,"estoque_minimo":5,"ativo":true},
  {"id":"prod_198","codigo":"MAT-198","nome":"CHAVE DE GRIFE STILLSON - 12","categoria":"Ferramentas & Acessórios","especie":"Aço / Ferramental","tipo_calculo":"UN","unidade_medida":"UN","preco_unitario":42,"taxa_plaina_padrao":0,"estoque_atual":25,"estoque_minimo":5,"ativo":true},
  {"id":"prod_199","codigo":"1-154","nome":"CHAVE FENDA  1/4 X 6\" GCORTE 6X150MM","categoria":"Ferramentas & Acessórios","especie":"Aço / Ferramental","tipo_calculo":"UN","unidade_medida":"UN","preco_unitario":14.4,"taxa_plaina_padrao":0,"estoque_atual":25,"estoque_minimo":5,"ativo":true},
  {"id":"prod_200","codigo":"1-155","nome":"CHAVE FENDA OU PHILIPS  3/16 X 4\" GCORTE (UM)","categoria":"Ferramentas & Acessórios","especie":"Aço / Ferramental","tipo_calculo":"UN","unidade_medida":"UN","preco_unitario":8.8,"taxa_plaina_padrao":0,"estoque_atual":25,"estoque_minimo":5,"ativo":true},
  {"id":"prod_201","codigo":"1-156","nome":"CHAVE HEXALOBULAR T10 A T40 COM 7 PÇ ( BRASFORT)","categoria":"Ferramentas & Acessórios","especie":"Aço / Ferramental","tipo_calculo":"UN","unidade_medida":"UN","preco_unitario":24,"taxa_plaina_padrao":0,"estoque_atual":25,"estoque_minimo":5,"ativo":true},
  {"id":"prod_202","codigo":"1-157","nome":"CHAVE INGLESA 08 FERTAK TOOLS HEAVY DUTY","categoria":"Ferramentas & Acessórios","especie":"Aço / Ferramental","tipo_calculo":"UN","unidade_medida":"UN","preco_unitario":47,"taxa_plaina_padrao":0,"estoque_atual":25,"estoque_minimo":5,"ativo":true},
  {"id":"prod_203","codigo":"1-158","nome":"CHAVE INGLESA 10 FERTAK TOOLS HEAVY DUTY","categoria":"Ferramentas & Acessórios","especie":"Aço / Ferramental","tipo_calculo":"UN","unidade_medida":"UN","preco_unitario":59,"taxa_plaina_padrao":0,"estoque_atual":25,"estoque_minimo":5,"ativo":true},
  {"id":"prod_204","codigo":"1-159","nome":"CHAVE INGLESA 12 FERTAK TOOLS HEAVY DUTY","categoria":"Ferramentas & Acessórios","especie":"Aço / Ferramental","tipo_calculo":"UN","unidade_medida":"UN","preco_unitario":80,"taxa_plaina_padrao":0,"estoque_atual":25,"estoque_minimo":5,"ativo":true},
  {"id":"prod_205","codigo":"1-162","nome":"CHAVE L LONGA GALVANIZADA 08 MM","categoria":"Ferramentas & Acessórios","especie":"Aço / Ferramental","tipo_calculo":"UN","unidade_medida":"UN","preco_unitario":15,"taxa_plaina_padrao":0,"estoque_atual":25,"estoque_minimo":5,"ativo":true},
  {"id":"prod_206","codigo":"1-163","nome":"CHAVE L LONGA GALVANIZADA 09 MM","categoria":"Ferramentas & Acessórios","especie":"Aço / Ferramental","tipo_calculo":"UN","unidade_medida":"UN","preco_unitario":16,"taxa_plaina_padrao":0,"estoque_atual":25,"estoque_minimo":5,"ativo":true},
  {"id":"prod_207","codigo":"1-164","nome":"CHAVE L LONGA GALVANIZADA 10 MM","categoria":"Ferramentas & Acessórios","especie":"Aço / Ferramental","tipo_calculo":"UN","unidade_medida":"UN","preco_unitario":17,"taxa_plaina_padrao":0,"estoque_atual":25,"estoque_minimo":5,"ativo":true},
  {"id":"prod_208","codigo":"1-165","nome":"CHAVE L LONGA GALVANIZADA 11 MM","categoria":"Ferramentas & Acessórios","especie":"Aço / Ferramental","tipo_calculo":"UN","unidade_medida":"UN","preco_unitario":19,"taxa_plaina_padrao":0,"estoque_atual":25,"estoque_minimo":5,"ativo":true},
  {"id":"prod_209","codigo":"1-166","nome":"CHAVE L LONGA GALVANIZADA 12 MM","categoria":"Ferramentas & Acessórios","especie":"Aço / Ferramental","tipo_calculo":"UN","unidade_medida":"UN","preco_unitario":23,"taxa_plaina_padrao":0,"estoque_atual":25,"estoque_minimo":5,"ativo":true},
  {"id":"prod_210","codigo":"1-167","nome":"CHAVE L LONGA GALVANIZADA 13 MM","categoria":"Ferramentas & Acessórios","especie":"Aço / Ferramental","tipo_calculo":"UN","unidade_medida":"UN","preco_unitario":25.5,"taxa_plaina_padrao":0,"estoque_atual":25,"estoque_minimo":5,"ativo":true},
  {"id":"prod_211","codigo":"1-168","nome":"CHAVE P/ MANDRIL 13MMX1/2 FERTAK TOOLS","categoria":"Ferramentas & Acessórios","especie":"Aço / Ferramental","tipo_calculo":"UN","unidade_medida":"UN","preco_unitario":12.8,"taxa_plaina_padrao":0,"estoque_atual":25,"estoque_minimo":5,"ativo":true},
  {"id":"prod_212","codigo":"1-169","nome":"CHAVE PHILIPS 1/4 X 6\" GCORTE 6X150MM","categoria":"Ferramentas & Acessórios","especie":"Aço / Ferramental","tipo_calculo":"UN","unidade_medida":"UN","preco_unitario":13.5,"taxa_plaina_padrao":0,"estoque_atual":25,"estoque_minimo":5,"ativo":true},
  {"id":"prod_213","codigo":"1-170","nome":"CHAVE PHILIPS 3/16 X 4\" GCORTE 5X100MM","categoria":"Ferramentas & Acessórios","especie":"Aço / Ferramental","tipo_calculo":"UN","unidade_medida":"UN","preco_unitario":8.5,"taxa_plaina_padrao":0,"estoque_atual":25,"estoque_minimo":5,"ativo":true},
  {"id":"prod_214","codigo":"MAT-214","nome":"CHAVE TESTE DIGITAL THOMPSON 120/220V","categoria":"Elétrica & Iluminação","especie":"Cobre / Termoplástico","tipo_calculo":"UN","unidade_medida":"UN","preco_unitario":9,"taxa_plaina_padrao":0,"estoque_atual":55,"estoque_minimo":15,"ativo":true},
  {"id":"prod_215","codigo":"1-172","nome":"CHURRASQUEIRA 4 EM 1 TIJOLINHO VERMELHO","categoria":"Construção & Alvenaria","especie":"Diversos","tipo_calculo":"UN","unidade_medida":"UN","preco_unitario":4335,"taxa_plaina_padrao":0,"estoque_atual":8,"estoque_minimo":2,"ativo":true},
  {"id":"prod_216","codigo":"1-173","nome":"CHURRASQUEIRA C/ FOGÃO MESCLADA","categoria":"Construção & Alvenaria","especie":"Mescla","tipo_calculo":"UN","unidade_medida":"UN","preco_unitario":2650,"taxa_plaina_padrao":0,"estoque_atual":8,"estoque_minimo":2,"ativo":true},
  {"id":"prod_217","codigo":"1-174","nome":"CHURRASQUEIRA C/ FOGÃO TIJOLO VERMELHO","categoria":"Construção & Alvenaria","especie":"Cerâmica","tipo_calculo":"UN","unidade_medida":"UN","preco_unitario":2520,"taxa_plaina_padrao":0,"estoque_atual":1500,"estoque_minimo":300,"ativo":true},
  {"id":"prod_218","codigo":"MAT-218","nome":"CHURRASQUEIRA C/ FOGÃOZINHO MESCLADA","categoria":"Construção & Alvenaria","especie":"Mescla","tipo_calculo":"UN","unidade_medida":"UN","preco_unitario":2650,"taxa_plaina_padrao":0,"estoque_atual":8,"estoque_minimo":2,"ativo":true},
  {"id":"prod_219","codigo":"MAT-219","nome":"CHURRASQUEIRA C/ FOGÃOZINHO TIJOLO VERMELHO","categoria":"Construção & Alvenaria","especie":"Cerâmica","tipo_calculo":"UN","unidade_medida":"UN","preco_unitario":2400,"taxa_plaina_padrao":0,"estoque_atual":1500,"estoque_minimo":300,"ativo":true},
  {"id":"prod_220","codigo":"1-175","nome":"CHURRASQUEIRA DUTO  MINI VERMELHO","categoria":"Construção & Alvenaria","especie":"Diversos","tipo_calculo":"UN","unidade_medida":"UN","preco_unitario":35,"taxa_plaina_padrao":0,"estoque_atual":8,"estoque_minimo":2,"ativo":true},
  {"id":"prod_221","codigo":"1-176","nome":"CHURRASQUEIRA DUTO COLONIAL 30X50","categoria":"Construção & Alvenaria","especie":"Diversos","tipo_calculo":"UN","unidade_medida":"UN","preco_unitario":83,"taxa_plaina_padrao":0,"estoque_atual":8,"estoque_minimo":2,"ativo":true},
  {"id":"prod_222","codigo":"1-177","nome":"CHURRASQUEIRA DUTO COLONIAL MESCLADO","categoria":"Construção & Alvenaria","especie":"Mescla","tipo_calculo":"UN","unidade_medida":"UN","preco_unitario":93,"taxa_plaina_padrao":0,"estoque_atual":8,"estoque_minimo":2,"ativo":true},
  {"id":"prod_223","codigo":"1-178","nome":"CHURRASQUEIRA DUTO LISO/ TOJOLINHO VER /MARFIM 25X30","categoria":"Construção & Alvenaria","especie":"Diversos","tipo_calculo":"UN","unidade_medida":"UN","preco_unitario":40,"taxa_plaina_padrao":0,"estoque_atual":8,"estoque_minimo":2,"ativo":true},
  {"id":"prod_224","codigo":"1-179","nome":"CHURRASQUEIRA DUTO MODULO PREDIAL LISO 25X65","categoria":"Construção & Alvenaria","especie":"Diversos","tipo_calculo":"UN","unidade_medida":"UN","preco_unitario":80,"taxa_plaina_padrao":0,"estoque_atual":8,"estoque_minimo":2,"ativo":true},
  {"id":"prod_225","codigo":"1-180","nome":"CHURRASQUEIRA M AMADEIRADA 0,65","categoria":"Construção & Alvenaria","especie":"Diversos","tipo_calculo":"UN","unidade_medida":"UN","preco_unitario":752,"taxa_plaina_padrao":0,"estoque_atual":8,"estoque_minimo":2,"ativo":true},
  {"id":"prod_226","codigo":"1-181","nome":"CHURRASQUEIRA M COLONIAL MARFIM BRANCA 0,65","categoria":"Construção & Alvenaria","especie":"Diversos","tipo_calculo":"UN","unidade_medida":"UN","preco_unitario":892.5,"taxa_plaina_padrao":0,"estoque_atual":8,"estoque_minimo":2,"ativo":true},
  {"id":"prod_227","codigo":"1-182","nome":"CHURRASQUEIRA M COLONIAL MESCLADO 0,65","categoria":"Construção & Alvenaria","especie":"Mescla","tipo_calculo":"UN","unidade_medida":"UN","preco_unitario":892.5,"taxa_plaina_padrao":0,"estoque_atual":8,"estoque_minimo":2,"ativo":true},
  {"id":"prod_228","codigo":"1-183","nome":"CHURRASQUEIRA M COLONIAL VERMELHA 0,65","categoria":"Construção & Alvenaria","especie":"Diversos","tipo_calculo":"UN","unidade_medida":"UN","preco_unitario":892.5,"taxa_plaina_padrao":0,"estoque_atual":8,"estoque_minimo":2,"ativo":true},
  {"id":"prod_229","codigo":"1-184","nome":"CHURRASQUEIRA M LISA 0,65","categoria":"Construção & Alvenaria","especie":"Diversos","tipo_calculo":"UN","unidade_medida":"UN","preco_unitario":660,"taxa_plaina_padrao":0,"estoque_atual":8,"estoque_minimo":2,"ativo":true},
  {"id":"prod_230","codigo":"1-185","nome":"CHURRASQUEIRA M PREDIAL C/ DOIS DUTO MODULO 0,65","categoria":"Construção & Alvenaria","especie":"Diversos","tipo_calculo":"UN","unidade_medida":"UN","preco_unitario":830,"taxa_plaina_padrao":0,"estoque_atual":8,"estoque_minimo":2,"ativo":true},
  {"id":"prod_231","codigo":"1-186","nome":"CHURRASQUEIRA M TIJOLINHO VERMELHO M 0,65","categoria":"Construção & Alvenaria","especie":"Diversos","tipo_calculo":"UN","unidade_medida":"UN","preco_unitario":752,"taxa_plaina_padrao":0,"estoque_atual":8,"estoque_minimo":2,"ativo":true},
  {"id":"prod_232","codigo":"1-187","nome":"CHURRASQUEIRA MASSA REFRATÁRIA 10 KG","categoria":"Construção & Alvenaria","especie":"Diversos","tipo_calculo":"UN","unidade_medida":"UN","preco_unitario":34.5,"taxa_plaina_padrao":0,"estoque_atual":8,"estoque_minimo":2,"ativo":true},
  {"id":"prod_233","codigo":"1-188","nome":"CHURRASQUEIRA TRIO TIJOLO C/ CHURRASQ. CHAPA 3 BOCA","categoria":"Construção & Alvenaria","especie":"Cerâmica","tipo_calculo":"UN","unidade_medida":"UN","preco_unitario":3150,"taxa_plaina_padrao":0,"estoque_atual":1500,"estoque_minimo":300,"ativo":true},
  {"id":"prod_234","codigo":"1-196","nome":"CHURRASQUEIRA: FOGÃO C/ FORNO","categoria":"Construção & Alvenaria","especie":"Diversos","tipo_calculo":"UN","unidade_medida":"UN","preco_unitario":2130,"taxa_plaina_padrao":0,"estoque_atual":8,"estoque_minimo":2,"ativo":true},
  {"id":"prod_235","codigo":"1-189","nome":"CHURRASQUEIRA: FOGÃO C/ RODINHA","categoria":"Construção & Alvenaria","especie":"Diversos","tipo_calculo":"UN","unidade_medida":"UN","preco_unitario":900,"taxa_plaina_padrao":0,"estoque_atual":8,"estoque_minimo":2,"ativo":true},
  {"id":"prod_236","codigo":"1-197","nome":"CHURRASQUEIRA: FOGÃO VERMELHO 3 BOCA","categoria":"Construção & Alvenaria","especie":"Diversos","tipo_calculo":"UN","unidade_medida":"UN","preco_unitario":1710,"taxa_plaina_padrao":0,"estoque_atual":8,"estoque_minimo":2,"ativo":true},
  {"id":"prod_237","codigo":"1-190","nome":"CHURRASQUEIRA: FOGÃOZINHO MESCLADO","categoria":"Construção & Alvenaria","especie":"Mescla","tipo_calculo":"UN","unidade_medida":"UN","preco_unitario":1680,"taxa_plaina_padrao":0,"estoque_atual":8,"estoque_minimo":2,"ativo":true},
  {"id":"prod_238","codigo":"1-191","nome":"CHURRASQUEIRA: FOGÃOZINHO TIJOLO VERMELHO","categoria":"Construção & Alvenaria","especie":"Cerâmica","tipo_calculo":"UN","unidade_medida":"UN","preco_unitario":1430,"taxa_plaina_padrao":0,"estoque_atual":1500,"estoque_minimo":300,"ativo":true},
  {"id":"prod_239","codigo":"1-192","nome":"CHURRASQUEIRA: GIRA GRIL C/ ESPETO 220 V","categoria":"Construção & Alvenaria","especie":"Diversos","tipo_calculo":"UN","unidade_medida":"UN","preco_unitario":686,"taxa_plaina_padrao":0,"estoque_atual":8,"estoque_minimo":2,"ativo":true},
  {"id":"prod_240","codigo":"1-193","nome":"CHURRASQUEIRA: MINI GRILL M","categoria":"Construção & Alvenaria","especie":"Diversos","tipo_calculo":"UN","unidade_medida":"UN","preco_unitario":480,"taxa_plaina_padrao":0,"estoque_atual":8,"estoque_minimo":2,"ativo":true},
  {"id":"prod_241","codigo":"1-194","nome":"CHURRASQUEIRA: MINI GRILL M C/ RODINHA","categoria":"Construção & Alvenaria","especie":"Diversos","tipo_calculo":"UN","unidade_medida":"UN","preco_unitario":675,"taxa_plaina_padrao":0,"estoque_atual":8,"estoque_minimo":2,"ativo":true},
  {"id":"prod_242","codigo":"1-195","nome":"CHURRASQUEIRA: SUPORT P/ MINI GRIL C/ RODINHA","categoria":"Construção & Alvenaria","especie":"Diversos","tipo_calculo":"UN","unidade_medida":"UN","preco_unitario":195,"taxa_plaina_padrao":0,"estoque_atual":8,"estoque_minimo":2,"ativo":true},
  {"id":"prod_243","codigo":"1-198","nome":"CHUVEIRO FAME FAMINHO 4T 220V X 6800 W","categoria":"Elétrica & Iluminação","especie":"Cobre / Termoplástico","tipo_calculo":"UN","unidade_medida":"UN","preco_unitario":86.4,"taxa_plaina_padrao":0,"estoque_atual":55,"estoque_minimo":15,"ativo":true},
  {"id":"prod_244","codigo":"1-199","nome":"CHUVEIRO FAME SUPER DUCHA 4T 220V X 6800 W","categoria":"Elétrica & Iluminação","especie":"Cobre / Termoplástico","tipo_calculo":"UN","unidade_medida":"UN","preco_unitario":95.1,"taxa_plaina_padrao":0,"estoque_atual":55,"estoque_minimo":15,"ativo":true},
  {"id":"prod_245","codigo":"1-200","nome":"CHUVEIRO SINTEX 3T 220V X 5500 W","categoria":"Elétrica & Iluminação","especie":"Cobre / Termoplástico","tipo_calculo":"UN","unidade_medida":"UN","preco_unitario":70.8,"taxa_plaina_padrao":0,"estoque_atual":55,"estoque_minimo":15,"ativo":true},
  {"id":"prod_246","codigo":"1-201","nome":"CINTA AMAR .CARG WESTERN  TAMANHO 2,5 CM X 4,5 M","categoria":"EPIs, Cordas & Diversos","especie":"Diversos","tipo_calculo":"UN","unidade_medida":"UN","preco_unitario":33,"taxa_plaina_padrao":0,"estoque_atual":40,"estoque_minimo":10,"ativo":true},
  {"id":"prod_247","codigo":"1-202","nome":"CINTA C/ CATRACA DE CAMINHÃO 5 TONELADAS","categoria":"EPIs, Cordas & Diversos","especie":"Diversos","tipo_calculo":"UN","unidade_medida":"UN","preco_unitario":153,"taxa_plaina_padrao":0,"estoque_atual":40,"estoque_minimo":10,"ativo":true},
  {"id":"prod_248","codigo":"1-203","nome":"CINTA LOMBAR ERGONOMICA TAMANHO M","categoria":"EPIs, Cordas & Diversos","especie":"Diversos","tipo_calculo":"UN","unidade_medida":"UN","preco_unitario":67.6,"taxa_plaina_padrao":0,"estoque_atual":40,"estoque_minimo":10,"ativo":true},
  {"id":"prod_249","codigo":"1-204","nome":"CINTA PARA CARGA C/ CATRACA 1\" (25,4MM)X4,5M CAP.120KG","categoria":"EPIs, Cordas & Diversos","especie":"Diversos","tipo_calculo":"UN","unidade_medida":"UN","preco_unitario":30,"taxa_plaina_padrao":0,"estoque_atual":40,"estoque_minimo":10,"ativo":true},
  {"id":"prod_250","codigo":"MAT-250","nome":"CLORO P/LIMPEZA VMAX 5L","categoria":"Tintas & Química","especie":"Químico","tipo_calculo":"UN","unidade_medida":"UN","preco_unitario":38,"taxa_plaina_padrao":0,"estoque_atual":35,"estoque_minimo":10,"ativo":true},
  {"id":"prod_251","codigo":"1-205","nome":"COLA 793 INSTANTANEA 20G TEK BOND","categoria":"Tintas & Química","especie":"Químico","tipo_calculo":"UN","unidade_medida":"UN","preco_unitario":14,"taxa_plaina_padrao":0,"estoque_atual":35,"estoque_minimo":10,"ativo":true},
  {"id":"prod_252","codigo":"1-206","nome":"COLA CANO TUBO 175G TIGRE","categoria":"Tintas & Química","especie":"Químico","tipo_calculo":"UN","unidade_medida":"UN","preco_unitario":21,"taxa_plaina_padrao":0,"estoque_atual":35,"estoque_minimo":10,"ativo":true},
  {"id":"prod_253","codigo":"1-207","nome":"COLA EXTRA PVC 500 G GARIN","categoria":"Tintas & Química","especie":"PVC","tipo_calculo":"UN","unidade_medida":"UN","preco_unitario":30,"taxa_plaina_padrao":0,"estoque_atual":35,"estoque_minimo":10,"ativo":true},
  {"id":"prod_254","codigo":"1-208","nome":"COLA MADEIRA 100 G GARIN","categoria":"Tintas & Química","especie":"Químico","tipo_calculo":"UN","unidade_medida":"UN","preco_unitario":4.5,"taxa_plaina_padrao":0,"estoque_atual":35,"estoque_minimo":10,"ativo":true},
  {"id":"prod_255","codigo":"MAT-255","nome":"COLA MADEIRA 100G GARIN  VEDAG","categoria":"Tintas & Química","especie":"Químico","tipo_calculo":"UN","unidade_medida":"UN","preco_unitario":4.5,"taxa_plaina_padrao":0,"estoque_atual":35,"estoque_minimo":10,"ativo":true},
  {"id":"prod_256","codigo":"1-209","nome":"COLA MADEIRA 250 G GARIN","categoria":"Tintas & Química","especie":"Químico","tipo_calculo":"UN","unidade_medida":"UN","preco_unitario":10.5,"taxa_plaina_padrao":0,"estoque_atual":35,"estoque_minimo":10,"ativo":true},
  {"id":"prod_257","codigo":"MAT-257","nome":"COLA MADEIRA 250G GARIN  VEDAG","categoria":"Tintas & Química","especie":"Químico","tipo_calculo":"UN","unidade_medida":"UN","preco_unitario":10.5,"taxa_plaina_padrao":0,"estoque_atual":35,"estoque_minimo":10,"ativo":true},
  {"id":"prod_258","codigo":"MAT-258","nome":"COLA MADEIRA 250G PULVITEC","categoria":"Tintas & Química","especie":"Químico","tipo_calculo":"UN","unidade_medida":"UN","preco_unitario":18.8,"taxa_plaina_padrao":0,"estoque_atual":35,"estoque_minimo":10,"ativo":true},
  {"id":"prod_259","codigo":"MAT-259","nome":"COLA SILICONE 256 G INCOLOR ACETICO TEKBOND","categoria":"Tintas & Química","especie":"Químico","tipo_calculo":"UN","unidade_medida":"UN","preco_unitario":20.4,"taxa_plaina_padrao":0,"estoque_atual":35,"estoque_minimo":10,"ativo":true},
  {"id":"prod_260","codigo":"MAT-260","nome":"COLA SILICONE INCOLOR ACETICO TEKBOND  50G","categoria":"Tintas & Química","especie":"Químico","tipo_calculo":"UN","unidade_medida":"UN","preco_unitario":9,"taxa_plaina_padrao":0,"estoque_atual":35,"estoque_minimo":10,"ativo":true},
  {"id":"prod_261","codigo":"1-210","nome":"COLHER DE PEDREIRO Nº 7\" PACETTA","categoria":"Ferramentas & Acessórios","especie":"Aço / Ferramental","tipo_calculo":"UN","unidade_medida":"UN","preco_unitario":32,"taxa_plaina_padrao":0,"estoque_atual":25,"estoque_minimo":5,"ativo":true},
  {"id":"prod_262","codigo":"1-211","nome":"COLHER DE PEDREIRO Nº 8\" PACETTA","categoria":"Ferramentas & Acessórios","especie":"Aço / Ferramental","tipo_calculo":"UN","unidade_medida":"UN","preco_unitario":35,"taxa_plaina_padrao":0,"estoque_atual":25,"estoque_minimo":5,"ativo":true},
  {"id":"prod_263","codigo":"1-212","nome":"COLHER DE PEDREIRO Nº 9\" PACETTA","categoria":"Ferramentas & Acessórios","especie":"Aço / Ferramental","tipo_calculo":"UN","unidade_medida":"UN","preco_unitario":38,"taxa_plaina_padrao":0,"estoque_atual":25,"estoque_minimo":5,"ativo":true},
  {"id":"prod_264","codigo":"1-213","nome":"COLUNA P/ LAVATORIO BRANCO ARAXA STA CLARA","categoria":"Construção & Alvenaria","especie":"Diversos","tipo_calculo":"UN","unidade_medida":"UN","preco_unitario":133,"taxa_plaina_padrao":0,"estoque_atual":8,"estoque_minimo":2,"ativo":true},
  {"id":"prod_265","codigo":"1-214","nome":"CONE SINALIZAÇÃO PLÁSTICO 75 CM","categoria":"EPIs, Cordas & Diversos","especie":"Diversos","tipo_calculo":"UN","unidade_medida":"UN","preco_unitario":43.2,"taxa_plaina_padrao":0,"estoque_atual":40,"estoque_minimo":10,"ativo":true},
  {"id":"prod_266","codigo":"1-215","nome":"CONECTOR EM BARRA 6MM 25 A 600V","categoria":"Elétrica & Iluminação","especie":"Cobre / Termoplástico","tipo_calculo":"UN","unidade_medida":"UN","preco_unitario":8.6,"taxa_plaina_padrao":0,"estoque_atual":55,"estoque_minimo":15,"ativo":true},
  {"id":"prod_267","codigo":"1-216","nome":"CONECTOR PORCELANA BIPOLAR 16MM 30A 600V","categoria":"Elétrica & Iluminação","especie":"Porcelana","tipo_calculo":"UN","unidade_medida":"UN","preco_unitario":6.4,"taxa_plaina_padrao":0,"estoque_atual":55,"estoque_minimo":15,"ativo":true},
  {"id":"prod_268","codigo":"1-217","nome":"CONECTOR PORCELANA TRIPOLAR 16MM 30A 600V","categoria":"Elétrica & Iluminação","especie":"Porcelana","tipo_calculo":"UN","unidade_medida":"UN","preco_unitario":9.6,"taxa_plaina_padrao":0,"estoque_atual":55,"estoque_minimo":15,"ativo":true},
  {"id":"prod_269","codigo":"1-218","nome":"CORANTE XADREX COR VARIADOS","categoria":"Tintas & Química","especie":"Químico","tipo_calculo":"UN","unidade_medida":"UN","preco_unitario":7,"taxa_plaina_padrao":0,"estoque_atual":35,"estoque_minimo":10,"ativo":true},
  {"id":"prod_270","codigo":"1-219","nome":"CORDA RIOMAR TROPICAL 10MM C/190M","categoria":"EPIs, Cordas & Diversos","especie":"Diversos","tipo_calculo":"UN","unidade_medida":"UN","preco_unitario":4.5,"taxa_plaina_padrao":0,"estoque_atual":40,"estoque_minimo":10,"ativo":true},
  {"id":"prod_271","codigo":"1-220","nome":"CORDA RIOMAR TROPICAL 12MM C/140M","categoria":"EPIs, Cordas & Diversos","especie":"Diversos","tipo_calculo":"UN","unidade_medida":"UN","preco_unitario":6,"taxa_plaina_padrao":0,"estoque_atual":40,"estoque_minimo":10,"ativo":true},
  {"id":"prod_272","codigo":"MAT-272","nome":"CORDA RIOMAR TROPICAL 4MM C/360M","categoria":"EPIs, Cordas & Diversos","especie":"Diversos","tipo_calculo":"UN","unidade_medida":"UN","preco_unitario":1.5,"taxa_plaina_padrao":0,"estoque_atual":40,"estoque_minimo":10,"ativo":true},
  {"id":"prod_273","codigo":"MAT-273","nome":"CORDA RIOMAR TROPICAL 5MM C/250M","categoria":"EPIs, Cordas & Diversos","especie":"Diversos","tipo_calculo":"UN","unidade_medida":"UN","preco_unitario":2.5,"taxa_plaina_padrao":0,"estoque_atual":40,"estoque_minimo":10,"ativo":true},
  {"id":"prod_274","codigo":"MAT-274","nome":"CORDA RIOMAR TROPICAL 6MM C/165M","categoria":"EPIs, Cordas & Diversos","especie":"Diversos","tipo_calculo":"UN","unidade_medida":"UN","preco_unitario":3.5,"taxa_plaina_padrao":0,"estoque_atual":40,"estoque_minimo":10,"ativo":true},
  {"id":"prod_275","codigo":"MAT-275","nome":"CORDA RIOMAR TROPICAL 8MM C/258M","categoria":"EPIs, Cordas & Diversos","especie":"Diversos","tipo_calculo":"UN","unidade_medida":"UN","preco_unitario":4,"taxa_plaina_padrao":0,"estoque_atual":40,"estoque_minimo":10,"ativo":true},
  {"id":"prod_276","codigo":"MAT-276","nome":"CORRUGADO FLEX PEAD (B) 3/4X50 M CINZA PEG&UZE","categoria":"Elétrica & Iluminação","especie":"Cobre / Termoplástico","tipo_calculo":"UN","unidade_medida":"UN","preco_unitario":45,"taxa_plaina_padrao":0,"estoque_atual":55,"estoque_minimo":15,"ativo":true},
  {"id":"prod_277","codigo":"1-226","nome":"CUNHA PARA ENXADA","categoria":"Ferramentas & Acessórios","especie":"Aço / Ferramental","tipo_calculo":"UN","unidade_medida":"UN","preco_unitario":2.7,"taxa_plaina_padrao":0,"estoque_atual":25,"estoque_minimo":5,"ativo":true},
  {"id":"prod_278","codigo":"1-227","nome":"CURVA ESG 90 CURTA 100MM PLASTUBOS","categoria":"Hidráulica & Conexões","especie":"PVC / Metal","tipo_calculo":"UN","unidade_medida":"UN","preco_unitario":20.7,"taxa_plaina_padrao":0,"estoque_atual":70,"estoque_minimo":20,"ativo":true},
  {"id":"prod_279","codigo":"1-228","nome":"CURVA ESG 90 CURTA 50MM PLASTUBOS","categoria":"Hidráulica & Conexões","especie":"PVC / Metal","tipo_calculo":"UN","unidade_medida":"UN","preco_unitario":10.8,"taxa_plaina_padrao":0,"estoque_atual":70,"estoque_minimo":20,"ativo":true},
  {"id":"prod_280","codigo":"1-229","nome":"CURVA SOLD 90 25MMPLASTUBOS","categoria":"Hidráulica & Conexões","especie":"PVC / Metal","tipo_calculo":"UN","unidade_medida":"UN","preco_unitario":3.6,"taxa_plaina_padrao":0,"estoque_atual":70,"estoque_minimo":20,"ativo":true},
  {"id":"prod_281","codigo":"MAT-281","nome":"DESEMGRIPANTE  250ML/120G  CHEMICOL","categoria":"Tintas & Química","especie":"Químico","tipo_calculo":"UN","unidade_medida":"UN","preco_unitario":9,"taxa_plaina_padrao":0,"estoque_atual":3,"estoque_minimo":15,"ativo":true},
  {"id":"prod_282","codigo":"1-230","nome":"DESEMGRIPANTE ANTIFERRUGEM  LUB","categoria":"Tintas & Química","especie":"Químico","tipo_calculo":"UN","unidade_medida":"UN","preco_unitario":10.2,"taxa_plaina_padrao":0,"estoque_atual":35,"estoque_minimo":10,"ativo":true},
  {"id":"prod_283","codigo":"1-231","nome":"DESEMPENADEIRA 22X34 AZUL LISA","categoria":"Ferramentas & Acessórios","especie":"Aço / Ferramental","tipo_calculo":"UN","unidade_medida":"UN","preco_unitario":15,"taxa_plaina_padrao":0,"estoque_atual":25,"estoque_minimo":5,"ativo":true},
  {"id":"prod_284","codigo":"1-232","nome":"DESEMPENADEIRA 8X16 AZUL LISA","categoria":"Ferramentas & Acessórios","especie":"Aço / Ferramental","tipo_calculo":"UN","unidade_medida":"UN","preco_unitario":7.8,"taxa_plaina_padrao":0,"estoque_atual":25,"estoque_minimo":5,"ativo":true},
  {"id":"prod_285","codigo":"MAT-285","nome":"DESENGRIPANTE E ANTICORROSIVO ETANIZ 300 ML","categoria":"Tintas & Química","especie":"Químico","tipo_calculo":"UN","unidade_medida":"UN","preco_unitario":11.5,"taxa_plaina_padrao":0,"estoque_atual":35,"estoque_minimo":10,"ativo":true},
  {"id":"prod_286","codigo":"MAT-286","nome":"DISCO ARADO Nº1 27CM","categoria":"Ferramentas & Acessórios","especie":"Aço / Ferramental","tipo_calculo":"UN","unidade_medida":"UN","preco_unitario":110.1,"taxa_plaina_padrao":0,"estoque_atual":25,"estoque_minimo":5,"ativo":true},
  {"id":"prod_287","codigo":"MAT-287","nome":"DISCO ARADO Nº3 40CM","categoria":"Ferramentas & Acessórios","especie":"Aço / Ferramental","tipo_calculo":"UN","unidade_medida":"UN","preco_unitario":172.2,"taxa_plaina_padrao":0,"estoque_atual":25,"estoque_minimo":5,"ativo":true},
  {"id":"prod_288","codigo":"1-233","nome":"DISCO CORTAR MAD. WOOD CARVING 155X22","categoria":"Ferramentas & Acessórios","especie":"Aço / Ferramental","tipo_calculo":"UN","unidade_medida":"UN","preco_unitario":27,"taxa_plaina_padrao":0,"estoque_atual":25,"estoque_minimo":5,"ativo":true},
  {"id":"prod_289","codigo":"1-234","nome":"DISCO CORTE 4\"  AÇO INOX GCORTE","categoria":"Ferramentas & Acessórios","especie":"Aço","tipo_calculo":"UN","unidade_medida":"UN","preco_unitario":10,"taxa_plaina_padrao":0,"estoque_atual":25,"estoque_minimo":5,"ativo":true},
  {"id":"prod_290","codigo":"1-235","nome":"DISCO CORTE 7\" AÇO INOX GCORTE","categoria":"Ferramentas & Acessórios","especie":"Aço","tipo_calculo":"UN","unidade_medida":"UN","preco_unitario":12.8,"taxa_plaina_padrao":0,"estoque_atual":25,"estoque_minimo":5,"ativo":true},
  {"id":"prod_291","codigo":"1-236","nome":"DISCO CORTE DIAM. PROF.  SECO MTX (731729)","categoria":"Ferramentas & Acessórios","especie":"Aço / Ferramental","tipo_calculo":"UN","unidade_medida":"UN","preco_unitario":20,"taxa_plaina_padrao":0,"estoque_atual":25,"estoque_minimo":5,"ativo":true},
  {"id":"prod_292","codigo":"1-237","nome":"DISCO CORTE DIAM. PROF. CONT.","categoria":"Ferramentas & Acessórios","especie":"Aço / Ferramental","tipo_calculo":"UN","unidade_medida":"UN","preco_unitario":20,"taxa_plaina_padrao":0,"estoque_atual":25,"estoque_minimo":5,"ativo":true},
  {"id":"prod_293","codigo":"MAT-293","nome":"DISCO CORTE DIAM. PROF. CONT. MTX (731849)","categoria":"Ferramentas & Acessórios","especie":"Aço / Ferramental","tipo_calculo":"UN","unidade_medida":"UN","preco_unitario":20,"taxa_plaina_padrao":0,"estoque_atual":25,"estoque_minimo":5,"ativo":true},
  {"id":"prod_294","codigo":"1-238","nome":"DISCO DESBASTE FERRO 4\"","categoria":"Ferramentas & Acessórios","especie":"Aço / Ferramental","tipo_calculo":"UN","unidade_medida":"UN","preco_unitario":6.8,"taxa_plaina_padrao":0,"estoque_atual":25,"estoque_minimo":5,"ativo":true},
  {"id":"prod_295","codigo":"MAT-295","nome":"DISCO DESBASTE FERRO 4\" FAMASTIL","categoria":"Ferramentas & Acessórios","especie":"Aço / Ferramental","tipo_calculo":"UN","unidade_medida":"UN","preco_unitario":6.8,"taxa_plaina_padrao":0,"estoque_atual":25,"estoque_minimo":5,"ativo":true},
  {"id":"prod_296","codigo":"1-239","nome":"DISCO DESBASTE FERRO 7\"","categoria":"Ferramentas & Acessórios","especie":"Aço / Ferramental","tipo_calculo":"UN","unidade_medida":"UN","preco_unitario":17.8,"taxa_plaina_padrao":0,"estoque_atual":25,"estoque_minimo":5,"ativo":true},
  {"id":"prod_297","codigo":"MAT-297","nome":"DISCO DESBASTE FERRO 7\" GALZER","categoria":"Ferramentas & Acessórios","especie":"Aço / Ferramental","tipo_calculo":"UN","unidade_medida":"UN","preco_unitario":17.8,"taxa_plaina_padrao":0,"estoque_atual":25,"estoque_minimo":5,"ativo":true},
  {"id":"prod_298","codigo":"1-240","nome":"DISCO DIAM. PROF. TURBO SECO MTX E GCORTE","categoria":"Ferramentas & Acessórios","especie":"Aço / Ferramental","tipo_calculo":"UN","unidade_medida":"UN","preco_unitario":21.8,"taxa_plaina_padrao":0,"estoque_atual":25,"estoque_minimo":5,"ativo":true},
  {"id":"prod_299","codigo":"MAT-299","nome":"DISCO DIAM. PROF. TURBO SECO MTX E GCORTE (731789)","categoria":"Ferramentas & Acessórios","especie":"Aço / Ferramental","tipo_calculo":"UN","unidade_medida":"UN","preco_unitario":21.8,"taxa_plaina_padrao":0,"estoque_atual":25,"estoque_minimo":5,"ativo":true},
  {"id":"prod_300","codigo":"1-241","nome":"DISCO FLAP FIBRA CLASSC 4\"GRÃO 80","categoria":"Ferramentas & Acessórios","especie":"Aço / Ferramental","tipo_calculo":"UN","unidade_medida":"UN","preco_unitario":8,"taxa_plaina_padrao":0,"estoque_atual":25,"estoque_minimo":5,"ativo":true},
  {"id":"prod_301","codigo":"MAT-301","nome":"DISCO FLAP GCORTE 4\"GRÃO 80","categoria":"Ferramentas & Acessórios","especie":"Aço / Ferramental","tipo_calculo":"UN","unidade_medida":"UN","preco_unitario":12.6,"taxa_plaina_padrao":0,"estoque_atual":25,"estoque_minimo":5,"ativo":true},
  {"id":"prod_302","codigo":"MAT-302","nome":"DISCO PARA ESCULPIR   115X22 MM","categoria":"Ferramentas & Acessórios","especie":"Aço / Ferramental","tipo_calculo":"UN","unidade_medida":"UN","preco_unitario":40,"taxa_plaina_padrao":0,"estoque_atual":25,"estoque_minimo":5,"ativo":true},
  {"id":"prod_303","codigo":"MAT-303","nome":"DISCO SERRA 4\" 24 DENTES GCORTE","categoria":"Ferramentas & Acessórios","especie":"Aço / Ferramental","tipo_calculo":"UN","unidade_medida":"UN","preco_unitario":19.5,"taxa_plaina_padrao":0,"estoque_atual":25,"estoque_minimo":5,"ativo":true},
  {"id":"prod_304","codigo":"1-245","nome":"DISCO SERRA 4\" 36 DENTES GCORTE","categoria":"Ferramentas & Acessórios","especie":"Aço / Ferramental","tipo_calculo":"UN","unidade_medida":"UN","preco_unitario":23.85,"taxa_plaina_padrao":0,"estoque_atual":25,"estoque_minimo":5,"ativo":true},
  {"id":"prod_305","codigo":"1-246","nome":"DISCO SERRA 7\" 24 DENTES GCORTE","categoria":"Ferramentas & Acessórios","especie":"Aço / Ferramental","tipo_calculo":"UN","unidade_medida":"UN","preco_unitario":42,"taxa_plaina_padrao":0,"estoque_atual":25,"estoque_minimo":5,"ativo":true},
  {"id":"prod_306","codigo":"1-247","nome":"DISCO SERRA 7\" 40 DENTES GCORTE","categoria":"Ferramentas & Acessórios","especie":"Aço / Ferramental","tipo_calculo":"UN","unidade_medida":"UN","preco_unitario":48,"taxa_plaina_padrao":0,"estoque_atual":25,"estoque_minimo":5,"ativo":true},
  {"id":"prod_307","codigo":"1-244","nome":"DISCO SERRA AÇO CARBONO 80 DENTES GCORTE","categoria":"Ferramentas & Acessórios","especie":"Aço","tipo_calculo":"UN","unidade_medida":"UN","preco_unitario":15,"taxa_plaina_padrao":0,"estoque_atual":25,"estoque_minimo":5,"ativo":true},
  {"id":"prod_308","codigo":"MAT-308","nome":"DISCO SERRA GCORTE 7\"40 DENTES","categoria":"Ferramentas & Acessórios","especie":"Aço / Ferramental","tipo_calculo":"UN","unidade_medida":"UN","preco_unitario":45,"taxa_plaina_padrao":0,"estoque_atual":25,"estoque_minimo":5,"ativo":true},
  {"id":"prod_309","codigo":"MAT-309","nome":"DISCO SERRA GCORTE AÇO CARBONO 80 DENTES","categoria":"Ferramentas & Acessórios","especie":"Aço","tipo_calculo":"UN","unidade_medida":"UN","preco_unitario":13.5,"taxa_plaina_padrao":0,"estoque_atual":25,"estoque_minimo":5,"ativo":true},
  {"id":"prod_310","codigo":"MAT-310","nome":"DISCO SERRA GCORTE MADEIRA 4\" 36 DENTES","categoria":"Ferramentas & Acessórios","especie":"Aço / Ferramental","tipo_calculo":"UN","unidade_medida":"UN","preco_unitario":22.5,"taxa_plaina_padrao":0,"estoque_atual":25,"estoque_minimo":5,"ativo":true},
  {"id":"prod_311","codigo":"MAT-311","nome":"DISCO SERRA GCORTE MADEIRA 7\" 24 DENTES","categoria":"Ferramentas & Acessórios","especie":"Aço / Ferramental","tipo_calculo":"UN","unidade_medida":"UN","preco_unitario":40.5,"taxa_plaina_padrao":0,"estoque_atual":25,"estoque_minimo":5,"ativo":true},
  {"id":"prod_312","codigo":"MAT-312","nome":"DISCO SERRA GCORTE MADEIRA 7\" 40 DENTES","categoria":"Ferramentas & Acessórios","especie":"Aço / Ferramental","tipo_calculo":"UN","unidade_medida":"UN","preco_unitario":45,"taxa_plaina_padrao":0,"estoque_atual":25,"estoque_minimo":5,"ativo":true},
  {"id":"prod_313","codigo":"1-248","nome":"DISCO SERRA MADEIRA 24 DENTES GCORTE 110MM","categoria":"Ferramentas & Acessórios","especie":"Aço / Ferramental","tipo_calculo":"UN","unidade_medida":"UN","preco_unitario":24,"taxa_plaina_padrao":0,"estoque_atual":25,"estoque_minimo":5,"ativo":true},
  {"id":"prod_314","codigo":"1-249","nome":"DISCO SERRA MADEIRA GCORTE 180MMX24TX22.23","categoria":"Ferramentas & Acessórios","especie":"Aço / Ferramental","tipo_calculo":"UN","unidade_medida":"UN","preco_unitario":30.8,"taxa_plaina_padrao":0,"estoque_atual":25,"estoque_minimo":5,"ativo":true},
  {"id":"prod_315","codigo":"MAT-315","nome":"DISCO TUNGSTENIO FURO 20","categoria":"Ferramentas & Acessórios","especie":"Aço / Ferramental","tipo_calculo":"UN","unidade_medida":"UN","preco_unitario":30,"taxa_plaina_padrao":0,"estoque_atual":25,"estoque_minimo":5,"ativo":true},
  {"id":"prod_316","codigo":"MAT-316","nome":"DISCO TUNGSTENIO FURO 22","categoria":"Ferramentas & Acessórios","especie":"Aço / Ferramental","tipo_calculo":"UN","unidade_medida":"UN","preco_unitario":33,"taxa_plaina_padrao":0,"estoque_atual":25,"estoque_minimo":5,"ativo":true},
  {"id":"prod_317","codigo":"1-250","nome":"DISCO TURBO JET LINHA PREMIUM GCORTE 110MM","categoria":"Ferramentas & Acessórios","especie":"Aço / Ferramental","tipo_calculo":"UN","unidade_medida":"UN","preco_unitario":30.4,"taxa_plaina_padrao":0,"estoque_atual":25,"estoque_minimo":5,"ativo":true},
  {"id":"prod_318","codigo":"1-251","nome":"DISCO TURBO VERDE GCORTE","categoria":"Ferramentas & Acessórios","especie":"Aço / Ferramental","tipo_calculo":"UN","unidade_medida":"UN","preco_unitario":18,"taxa_plaina_padrao":0,"estoque_atual":25,"estoque_minimo":5,"ativo":true},
  {"id":"prod_319","codigo":"1-252","nome":"DISJUNTOR DIN BIP C 50A CURVA C STECK","categoria":"Elétrica & Iluminação","especie":"Cobre / Termoplástico","tipo_calculo":"UN","unidade_medida":"UN","preco_unitario":60,"taxa_plaina_padrao":0,"estoque_atual":55,"estoque_minimo":15,"ativo":true},
  {"id":"prod_320","codigo":"1-253","nome":"DISJUNTOR DIN BIP C 63A CURVA C STECK","categoria":"Elétrica & Iluminação","especie":"Cobre / Termoplástico","tipo_calculo":"UN","unidade_medida":"UN","preco_unitario":79.5,"taxa_plaina_padrao":0,"estoque_atual":55,"estoque_minimo":15,"ativo":true},
  {"id":"prod_321","codigo":"MAT-321","nome":"DOBRADIÇA P/ MADEIRA ROLIÇO G","categoria":"Ferragens & Cercas","especie":"Aço Galvanizado","tipo_calculo":"UN","unidade_medida":"UN","preco_unitario":70.5,"taxa_plaina_padrao":0,"estoque_atual":45,"estoque_minimo":10,"ativo":true},
  {"id":"prod_322","codigo":"MAT-322","nome":"DOBRADIÇA P/ MADEIRA ROLIÇO M","categoria":"Ferragens & Cercas","especie":"Aço Galvanizado","tipo_calculo":"UN","unidade_medida":"UN","preco_unitario":51,"taxa_plaina_padrao":0,"estoque_atual":45,"estoque_minimo":10,"ativo":true},
  {"id":"prod_323","codigo":"MAT-323","nome":"DOBRADIÇA P/ MADEIRA ROLIÇO P","categoria":"Ferragens & Cercas","especie":"Aço Galvanizado","tipo_calculo":"UN","unidade_medida":"UN","preco_unitario":39,"taxa_plaina_padrao":0,"estoque_atual":45,"estoque_minimo":10,"ativo":true},
  {"id":"prod_324","codigo":"1-259","nome":"DOBRADIÇA PORTA Nº 1. 1/2 -257","categoria":"Ferragens & Cercas","especie":"Aço Galvanizado","tipo_calculo":"UN","unidade_medida":"UN","preco_unitario":8.85,"taxa_plaina_padrao":0,"estoque_atual":45,"estoque_minimo":10,"ativo":true},
  {"id":"prod_325","codigo":"1-260","nome":"DOBRADIÇA PORTA Nº 2 -258","categoria":"Ferragens & Cercas","especie":"Aço Galvanizado","tipo_calculo":"UN","unidade_medida":"UN","preco_unitario":10.2,"taxa_plaina_padrao":0,"estoque_atual":45,"estoque_minimo":10,"ativo":true},
  {"id":"prod_326","codigo":"1-261","nome":"DOBRADIÇA PORTA Nº 2. 1/2 -259","categoria":"Ferragens & Cercas","especie":"Aço Galvanizado","tipo_calculo":"UN","unidade_medida":"UN","preco_unitario":12,"taxa_plaina_padrao":0,"estoque_atual":45,"estoque_minimo":10,"ativo":true},
  {"id":"prod_327","codigo":"1-262","nome":"DOBRADIÇA PORTA Nº 3 -260","categoria":"Ferragens & Cercas","especie":"Aço Galvanizado","tipo_calculo":"UN","unidade_medida":"UN","preco_unitario":15.6,"taxa_plaina_padrao":0,"estoque_atual":45,"estoque_minimo":10,"ativo":true},
  {"id":"prod_328","codigo":"1-263","nome":"DOBRADIÇA PORTA Nº 3. 1/2 -261","categoria":"Ferragens & Cercas","especie":"Aço Galvanizado","tipo_calculo":"UN","unidade_medida":"UN","preco_unitario":21,"taxa_plaina_padrao":0,"estoque_atual":45,"estoque_minimo":10,"ativo":true},
  {"id":"prod_329","codigo":"MAT-329","nome":"DOBRADIÇA PORTEIRA Nº 0","categoria":"Ferragens & Cercas","especie":"Aço Galvanizado","tipo_calculo":"UN","unidade_medida":"UN","preco_unitario":13.5,"taxa_plaina_padrao":0,"estoque_atual":45,"estoque_minimo":10,"ativo":true},
  {"id":"prod_330","codigo":"MAT-330","nome":"DOBRADIÇA PORTEIRA Nº 00","categoria":"Ferragens & Cercas","especie":"Aço Galvanizado","tipo_calculo":"UN","unidade_medida":"UN","preco_unitario":14.5,"taxa_plaina_padrao":0,"estoque_atual":45,"estoque_minimo":10,"ativo":true},
  {"id":"prod_331","codigo":"1-255","nome":"DOBRADIÇA PORTEIRA Nº 01","categoria":"Ferragens & Cercas","especie":"Aço Galvanizado","tipo_calculo":"UN","unidade_medida":"UN","preco_unitario":27.6,"taxa_plaina_padrao":0,"estoque_atual":45,"estoque_minimo":10,"ativo":true},
  {"id":"prod_332","codigo":"1-256","nome":"DOBRADIÇA PORTEIRA Nº 02","categoria":"Ferragens & Cercas","especie":"Aço Galvanizado","tipo_calculo":"UN","unidade_medida":"UN","preco_unitario":34.35,"taxa_plaina_padrao":0,"estoque_atual":45,"estoque_minimo":10,"ativo":true},
  {"id":"prod_333","codigo":"1-257","nome":"DOBRADIÇA PORTEIRA Nº 03","categoria":"Ferragens & Cercas","especie":"Aço Galvanizado","tipo_calculo":"UN","unidade_medida":"UN","preco_unitario":53.25,"taxa_plaina_padrao":0,"estoque_atual":45,"estoque_minimo":10,"ativo":true},
  {"id":"prod_334","codigo":"1-258","nome":"DOBRADIÇA PORTEIRA Nº 04","categoria":"Ferragens & Cercas","especie":"Aço Galvanizado","tipo_calculo":"UN","unidade_medida":"UN","preco_unitario":67.65,"taxa_plaina_padrao":0,"estoque_atual":45,"estoque_minimo":10,"ativo":true},
  {"id":"prod_335","codigo":"1-254","nome":"DOBRADIÇA SÃO ROQ PORTEIRA Nº 00","categoria":"Ferragens & Cercas","especie":"Aço Galvanizado","tipo_calculo":"UN","unidade_medida":"UN","preco_unitario":16.2,"taxa_plaina_padrao":0,"estoque_atual":45,"estoque_minimo":10,"ativo":true},
  {"id":"prod_336","codigo":"MAT-336","nome":"DOBRADIÇAS  ZINC. GAL DA ROCHA C/ 3 PÇ P/ PORTA 3 (323/20)","categoria":"Ferragens & Cercas","especie":"Aço Galvanizado","tipo_calculo":"UN","unidade_medida":"UN","preco_unitario":17.6,"taxa_plaina_padrao":0,"estoque_atual":45,"estoque_minimo":10,"ativo":true},
  {"id":"prod_337","codigo":"MAT-337","nome":"DOBRADIÇAS  ZINC. GAL. DA ROCHA C/ 3 PÇ P/ PORTA 3.1/2 (027/23)","categoria":"Ferragens & Cercas","especie":"Aço Galvanizado","tipo_calculo":"UN","unidade_medida":"UN","preco_unitario":22.4,"taxa_plaina_padrao":0,"estoque_atual":45,"estoque_minimo":10,"ativo":true},
  {"id":"prod_338","codigo":"MAT-338","nome":"DOBRADIÇAS BOLANEIS ISERO C/ 3 PÇ P/ PORTA","categoria":"Ferragens & Cercas","especie":"Aço Galvanizado","tipo_calculo":"UN","unidade_medida":"UN","preco_unitario":64,"taxa_plaina_padrao":0,"estoque_atual":45,"estoque_minimo":10,"ativo":true},
  {"id":"prod_339","codigo":"MAT-339","nome":"DOBRADIÇAS ZINC. GAL. DA ROCHA C/ 3 PÇ P/ PORTA 1.1/2 (102/23)","categoria":"Ferragens & Cercas","especie":"Aço Galvanizado","tipo_calculo":"UN","unidade_medida":"UN","preco_unitario":11.6,"taxa_plaina_padrao":0,"estoque_atual":45,"estoque_minimo":10,"ativo":true},
  {"id":"prod_340","codigo":"MAT-340","nome":"DOBRADIÇAS ZINC. GAL. DA ROCHA C/ 3 PÇ P/ PORTA 2.1/2 (163/23)","categoria":"Ferragens & Cercas","especie":"Aço Galvanizado","tipo_calculo":"UN","unidade_medida":"UN","preco_unitario":16.8,"taxa_plaina_padrao":0,"estoque_atual":45,"estoque_minimo":10,"ativo":true},
  {"id":"prod_341","codigo":"MAT-341","nome":"DUREPOXI LOCTITE BRANCA","categoria":"Tintas & Química","especie":"Químico","tipo_calculo":"UN","unidade_medida":"UN","preco_unitario":7.5,"taxa_plaina_padrao":0,"estoque_atual":35,"estoque_minimo":10,"ativo":true},
  {"id":"prod_342","codigo":"1-265","nome":"ELETRODO 2,50 MM 1 KG 50 PÇS P/ KG 7018 / KG 30 PÇS P/KG E6013","categoria":"Ferramentas & Acessórios","especie":"Aço / Ferramental","tipo_calculo":"UN","unidade_medida":"KG","preco_unitario":25.2,"taxa_plaina_padrao":0,"estoque_atual":25,"estoque_minimo":5,"ativo":true},
  {"id":"prod_343","codigo":"1-266","nome":"ELETRODO 3,25 MM 1 KG 30 PÇS P/ KG 7018 / KG 30 PÇS P/KG E6013","categoria":"Ferramentas & Acessórios","especie":"Aço / Ferramental","tipo_calculo":"UN","unidade_medida":"KG","preco_unitario":25.2,"taxa_plaina_padrao":0,"estoque_atual":25,"estoque_minimo":5,"ativo":true},
  {"id":"prod_344","codigo":"1-267","nome":"ELETRODO 4,0 MM  1KG 14 PÇS P/ KG E7018 / KG 14 PÇS P/ KG","categoria":"Ferramentas & Acessórios","especie":"Aço / Ferramental","tipo_calculo":"UN","unidade_medida":"KG","preco_unitario":25.2,"taxa_plaina_padrao":0,"estoque_atual":25,"estoque_minimo":5,"ativo":true},
  {"id":"prod_345","codigo":"1-268","nome":"ELETROUDO  AWES E7018","categoria":"Ferramentas & Acessórios","especie":"Aço / Ferramental","tipo_calculo":"UN","unidade_medida":"UN","preco_unitario":2.1,"taxa_plaina_padrao":0,"estoque_atual":25,"estoque_minimo":5,"ativo":true},
  {"id":"prod_346","codigo":"1-269","nome":"ENGATE FLEXIVEL DVG TUBOZAN 1/2 X 50 CM ÁGUA FRIA","categoria":"Hidráulica & Conexões","especie":"PVC / Metal","tipo_calculo":"UN","unidade_medida":"UN","preco_unitario":11.4,"taxa_plaina_padrao":0,"estoque_atual":70,"estoque_minimo":20,"ativo":true},
  {"id":"prod_347","codigo":"1-270","nome":"ENGATE FLEXIVEL YBRP 1/2 X 30 CM ÁGUA FRIA","categoria":"Hidráulica & Conexões","especie":"PVC / Metal","tipo_calculo":"UN","unidade_medida":"UN","preco_unitario":6.9,"taxa_plaina_padrao":0,"estoque_atual":70,"estoque_minimo":20,"ativo":true},
  {"id":"prod_348","codigo":"1-271","nome":"ENGATE RAPIDO PVC","categoria":"Hidráulica & Conexões","especie":"PVC","tipo_calculo":"UN","unidade_medida":"UN","preco_unitario":4.8,"taxa_plaina_padrao":0,"estoque_atual":70,"estoque_minimo":20,"ativo":true},
  {"id":"prod_349","codigo":"MAT-349","nome":"ENGATE RAPIDO PVC TRAMONTINA","categoria":"Hidráulica & Conexões","especie":"PVC","tipo_calculo":"UN","unidade_medida":"UN","preco_unitario":4.8,"taxa_plaina_padrao":0,"estoque_atual":70,"estoque_minimo":20,"ativo":true},
  {"id":"prod_350","codigo":"1-272","nome":"ENGATE UNIÃO RAPIDO PVC FEMEA","categoria":"Hidráulica & Conexões","especie":"PVC","tipo_calculo":"UN","unidade_medida":"UN","preco_unitario":3.3,"taxa_plaina_padrao":0,"estoque_atual":70,"estoque_minimo":20,"ativo":true},
  {"id":"prod_351","codigo":"MAT-351","nome":"ENGATE UNIÃO RAPIDO PVC FEMEA TRAMONTINA","categoria":"Hidráulica & Conexões","especie":"PVC","tipo_calculo":"UN","unidade_medida":"UN","preco_unitario":3.2,"taxa_plaina_padrao":0,"estoque_atual":70,"estoque_minimo":20,"ativo":true},
  {"id":"prod_352","codigo":"1-273","nome":"ENTRADA DE MAQUINA 1,40 M PLASTIC","categoria":"Hidráulica & Conexões","especie":"PVC / Metal","tipo_calculo":"UN","unidade_medida":"UN","preco_unitario":10.8,"taxa_plaina_padrao":0,"estoque_atual":70,"estoque_minimo":20,"ativo":true},
  {"id":"prod_353","codigo":"1-274","nome":"ENTRADA DE TANQUINHO 1 M PLASTIC","categoria":"Hidráulica & Conexões","especie":"PVC / Metal","tipo_calculo":"UN","unidade_medida":"UN","preco_unitario":5.8,"taxa_plaina_padrao":0,"estoque_atual":70,"estoque_minimo":20,"ativo":true},
  {"id":"prod_354","codigo":"1-275","nome":"ENXADA CURRAL ALPE 2,5 L 36 CM","categoria":"Ferramentas & Acessórios","especie":"Aço / Ferramental","tipo_calculo":"UN","unidade_medida":"UN","preco_unitario":73,"taxa_plaina_padrao":0,"estoque_atual":25,"estoque_minimo":5,"ativo":true},
  {"id":"prod_355","codigo":"1-276","nome":"ENXADA LARGA ALPE 2,5 GOIVADA","categoria":"Ferramentas & Acessórios","especie":"Aço / Ferramental","tipo_calculo":"UN","unidade_medida":"UN","preco_unitario":81,"taxa_plaina_padrao":0,"estoque_atual":25,"estoque_minimo":5,"ativo":true},
  {"id":"prod_356","codigo":"1-277","nome":"ENXADA RAMADA LARGA 2,5 C CABO","categoria":"Ferramentas & Acessórios","especie":"Aço / Ferramental","tipo_calculo":"UN","unidade_medida":"UN","preco_unitario":57,"taxa_plaina_padrao":0,"estoque_atual":25,"estoque_minimo":5,"ativo":true},
  {"id":"prod_357","codigo":"1-278","nome":"ENXADA TRADIÇÃO COM CABO 30 - FUZIL","categoria":"Ferramentas & Acessórios","especie":"Aço / Ferramental","tipo_calculo":"UN","unidade_medida":"UN","preco_unitario":98,"taxa_plaina_padrao":0,"estoque_atual":25,"estoque_minimo":5,"ativo":true},
  {"id":"prod_358","codigo":"1-279","nome":"ENXADÃO ESTREITO MAX C/ CABO 1,20 CM","categoria":"Ferramentas & Acessórios","especie":"Aço / Ferramental","tipo_calculo":"UN","unidade_medida":"UN","preco_unitario":63,"taxa_plaina_padrao":0,"estoque_atual":25,"estoque_minimo":5,"ativo":true},
  {"id":"prod_359","codigo":"1-280","nome":"ENXADÃO LARGO MAX 2,5 C/ CABO 1,20 CM","categoria":"Ferramentas & Acessórios","especie":"Aço / Ferramental","tipo_calculo":"UN","unidade_medida":"UN","preco_unitario":68,"taxa_plaina_padrao":0,"estoque_atual":25,"estoque_minimo":5,"ativo":true},
  {"id":"prod_360","codigo":"1-281","nome":"ESCADA EXTENSÍVEL ALUMINIO MOR 3 DEGRAUS","categoria":"Ferramentas & Acessórios","especie":"Alumínio","tipo_calculo":"UN","unidade_medida":"UN","preco_unitario":166.2,"taxa_plaina_padrao":0,"estoque_atual":25,"estoque_minimo":5,"ativo":true},
  {"id":"prod_361","codigo":"1-282","nome":"ESCADA EXTENSÍVEL ALUMINIO MOR 6 DEGRAUS","categoria":"Ferramentas & Acessórios","especie":"Alumínio","tipo_calculo":"UN","unidade_medida":"UN","preco_unitario":296.1,"taxa_plaina_padrao":0,"estoque_atual":25,"estoque_minimo":5,"ativo":true},
  {"id":"prod_362","codigo":"MAT-362","nome":"ESCADA EXTENSÍVEL ALUMINIO MOR 8 DEGRAUS","categoria":"Ferramentas & Acessórios","especie":"Alumínio","tipo_calculo":"UN","unidade_medida":"UN","preco_unitario":609,"taxa_plaina_padrao":0,"estoque_atual":25,"estoque_minimo":5,"ativo":true},
  {"id":"prod_363","codigo":"1-283","nome":"ESCOVA DE AÇO CARBONO MANUAL C/ MADEIRA SPANTA","categoria":"Ferramentas & Acessórios","especie":"Aço","tipo_calculo":"UN","unidade_medida":"UN","preco_unitario":8,"taxa_plaina_padrao":0,"estoque_atual":25,"estoque_minimo":5,"ativo":true},
  {"id":"prod_364","codigo":"1-284","nome":"ESGUICHO (GRANDE) P/ MANGUEIRA 44CM","categoria":"Hidráulica & Conexões","especie":"PVC / Metal","tipo_calculo":"UN","unidade_medida":"UN","preco_unitario":37.5,"taxa_plaina_padrao":0,"estoque_atual":70,"estoque_minimo":20,"ativo":true},
  {"id":"prod_365","codigo":"1-285","nome":"ESGUICHO (PEQUENO) P/ MANGUEIRA 21CM","categoria":"Hidráulica & Conexões","especie":"PVC / Metal","tipo_calculo":"UN","unidade_medida":"UN","preco_unitario":31.6,"taxa_plaina_padrao":0,"estoque_atual":70,"estoque_minimo":20,"ativo":true},
  {"id":"prod_366","codigo":"1-286","nome":"ESPATULA AÇO TEMPERADO COMPEL Nº 04","categoria":"Ferramentas & Acessórios","especie":"Aço","tipo_calculo":"UN","unidade_medida":"UN","preco_unitario":5.4,"taxa_plaina_padrao":0,"estoque_atual":25,"estoque_minimo":5,"ativo":true},
  {"id":"prod_367","codigo":"1-287","nome":"ESPATULA AÇO TEMPERADO COMPEL Nº 06","categoria":"Ferramentas & Acessórios","especie":"Aço","tipo_calculo":"UN","unidade_medida":"UN","preco_unitario":6.2,"taxa_plaina_padrao":0,"estoque_atual":25,"estoque_minimo":5,"ativo":true},
  {"id":"prod_368","codigo":"1-288","nome":"ESPATULA AÇO TEMPERADO COMPEL Nº 08","categoria":"Ferramentas & Acessórios","especie":"Aço","tipo_calculo":"UN","unidade_medida":"UN","preco_unitario":7,"taxa_plaina_padrao":0,"estoque_atual":25,"estoque_minimo":5,"ativo":true},
  {"id":"prod_369","codigo":"1-289","nome":"ESPUMA EXPANSIVA DE PU 230G TEKBOND","categoria":"Tintas & Química","especie":"Químico","tipo_calculo":"UN","unidade_medida":"UN","preco_unitario":33.8,"taxa_plaina_padrao":0,"estoque_atual":35,"estoque_minimo":10,"ativo":true},
  {"id":"prod_370","codigo":"1-290","nome":"ESQUADRO DE AÇO 12","categoria":"Ferramentas & Acessórios","especie":"Aço","tipo_calculo":"UN","unidade_medida":"UN","preco_unitario":16.8,"taxa_plaina_padrao":0,"estoque_atual":25,"estoque_minimo":5,"ativo":true},
  {"id":"prod_371","codigo":"1-291","nome":"ESTILETE 18 MM","categoria":"Ferramentas & Acessórios","especie":"Aço / Ferramental","tipo_calculo":"UN","unidade_medida":"UN","preco_unitario":9.8,"taxa_plaina_padrao":0,"estoque_atual":25,"estoque_minimo":5,"ativo":true},
  {"id":"prod_372","codigo":"1-292","nome":"ESTILETE 18 MM PROF. FIXAÇÃO C/ PARAF.","categoria":"Ferramentas & Acessórios","especie":"Aço / Ferramental","tipo_calculo":"UN","unidade_medida":"UN","preco_unitario":18.2,"taxa_plaina_padrao":0,"estoque_atual":25,"estoque_minimo":5,"ativo":true},
  {"id":"prod_373","codigo":"1-294","nome":"ESTRIBO P/ENGRADAMENTO 30X6 (3/16-2¨) - (CADA)","categoria":"Fixação & Pregos","especie":"Aço","tipo_calculo":"UN","unidade_medida":"UN","preco_unitario":60,"taxa_plaina_padrao":0,"estoque_atual":120,"estoque_minimo":30,"ativo":true},
  {"id":"prod_374","codigo":"1-293","nome":"ETIQUETA VOLT 127V C/16","categoria":"Elétrica & Iluminação","especie":"Cobre / Termoplástico","tipo_calculo":"UN","unidade_medida":"UN","preco_unitario":8.2,"taxa_plaina_padrao":0,"estoque_atual":55,"estoque_minimo":15,"ativo":true},
  {"id":"prod_375","codigo":"1-295","nome":"EXTENSÃO CROMADA 1/2 LONGA COMP 7,6 CM (11852E)","categoria":"Elétrica & Iluminação","especie":"Cobre / Termoplástico","tipo_calculo":"UN","unidade_medida":"UN","preco_unitario":13.8,"taxa_plaina_padrao":0,"estoque_atual":55,"estoque_minimo":15,"ativo":true},
  {"id":"prod_376","codigo":"MAT-376","nome":"EXTENSÃO ELETRICA 2P 10 A ILUMI 3 MTS","categoria":"Elétrica & Iluminação","especie":"Cobre / Termoplástico","tipo_calculo":"UN","unidade_medida":"UN","preco_unitario":21,"taxa_plaina_padrao":0,"estoque_atual":55,"estoque_minimo":15,"ativo":true},
  {"id":"prod_377","codigo":"MAT-377","nome":"EXTENSÃO ELETRICA 2P 10 A ILUMI 5 MTS","categoria":"Elétrica & Iluminação","especie":"Cobre / Termoplástico","tipo_calculo":"UN","unidade_medida":"UN","preco_unitario":26,"taxa_plaina_padrao":0,"estoque_atual":55,"estoque_minimo":15,"ativo":true},
  {"id":"prod_378","codigo":"1-296","nome":"EXTENSÃO ELETRICA 2P 3 MTS","categoria":"Elétrica & Iluminação","especie":"Cobre / Termoplástico","tipo_calculo":"UN","unidade_medida":"UN","preco_unitario":26.7,"taxa_plaina_padrao":0,"estoque_atual":55,"estoque_minimo":15,"ativo":true},
  {"id":"prod_379","codigo":"1-297","nome":"EXTENSÃO ELETRICA 2P 5 MTS","categoria":"Elétrica & Iluminação","especie":"Cobre / Termoplástico","tipo_calculo":"UN","unidade_medida":"UN","preco_unitario":37.2,"taxa_plaina_padrao":0,"estoque_atual":55,"estoque_minimo":15,"ativo":true},
  {"id":"prod_380","codigo":"1-298","nome":"EXTENSÃO ELETRICA 3P 10 MTS","categoria":"Elétrica & Iluminação","especie":"Cobre / Termoplástico","tipo_calculo":"UN","unidade_medida":"UN","preco_unitario":67.5,"taxa_plaina_padrao":0,"estoque_atual":55,"estoque_minimo":15,"ativo":true},
  {"id":"prod_381","codigo":"MAT-381","nome":"EXTENSÃO ELETRICA LIDER LUX 10 METROS","categoria":"Elétrica & Iluminação","especie":"Cobre / Termoplástico","tipo_calculo":"UN","unidade_medida":"UN","preco_unitario":43.5,"taxa_plaina_padrao":0,"estoque_atual":55,"estoque_minimo":15,"ativo":true},
  {"id":"prod_382","codigo":"1-299","nome":"EXTENSÃO ELETRICA LIDER LUX 5 METROS","categoria":"Elétrica & Iluminação","especie":"Cobre / Termoplástico","tipo_calculo":"UN","unidade_medida":"UN","preco_unitario":26.8,"taxa_plaina_padrao":0,"estoque_atual":55,"estoque_minimo":15,"ativo":true},
  {"id":"prod_383","codigo":"1-300","nome":"EXTENSÃO FILTRO DE LINHA  3 TOMADA (1 MT) KITEC","categoria":"Elétrica & Iluminação","especie":"Cobre / Termoplástico","tipo_calculo":"UN","unidade_medida":"UN","preco_unitario":33,"taxa_plaina_padrao":0,"estoque_atual":55,"estoque_minimo":15,"ativo":true},
  {"id":"prod_384","codigo":"1-301","nome":"EXTENSÃO FILTRO DE LINHA  4 TOMADA (1 MT) KITEC","categoria":"Elétrica & Iluminação","especie":"Cobre / Termoplástico","tipo_calculo":"UN","unidade_medida":"UN","preco_unitario":27,"taxa_plaina_padrao":0,"estoque_atual":55,"estoque_minimo":15,"ativo":true},
  {"id":"prod_385","codigo":"1-302","nome":"FACÃO MATO TRAMONTINA Nº 12","categoria":"Ferramentas & Acessórios","especie":"Aço / Ferramental","tipo_calculo":"UN","unidade_medida":"UN","preco_unitario":29.1,"taxa_plaina_padrao":0,"estoque_atual":25,"estoque_minimo":5,"ativo":true},
  {"id":"prod_386","codigo":"1-303","nome":"FACÃO MATO TRAMONTINA Nº 16","categoria":"Ferramentas & Acessórios","especie":"Aço / Ferramental","tipo_calculo":"UN","unidade_medida":"UN","preco_unitario":36,"taxa_plaina_padrao":0,"estoque_atual":25,"estoque_minimo":5,"ativo":true},
  {"id":"prod_387","codigo":"1-304","nome":"FACÃO MATO TRAMONTINA Nº 18","categoria":"Ferramentas & Acessórios","especie":"Aço / Ferramental","tipo_calculo":"UN","unidade_medida":"UN","preco_unitario":38.7,"taxa_plaina_padrao":0,"estoque_atual":25,"estoque_minimo":5,"ativo":true},
  {"id":"prod_388","codigo":"MAT-388","nome":"FECH RES BELLA 36 ES MACANETA ALAVANCA 3F (732B124OX)","categoria":"Ferragens & Cercas","especie":"Aço Galvanizado","tipo_calculo":"UN","unidade_medida":"UN","preco_unitario":71.8,"taxa_plaina_padrao":0,"estoque_atual":45,"estoque_minimo":10,"ativo":true},
  {"id":"prod_389","codigo":"MAT-389","nome":"FECH RES ROS RED BAN MACANETA ALAVANCA 3F (722B124CR)","categoria":"Ferragens & Cercas","especie":"Aço Galvanizado","tipo_calculo":"UN","unidade_medida":"UN","preco_unitario":73.6,"taxa_plaina_padrao":0,"estoque_atual":45,"estoque_minimo":10,"ativo":true},
  {"id":"prod_390","codigo":"1-307","nome":"FECHADURA BANHEIRO","categoria":"Ferragens & Cercas","especie":"Aço Galvanizado","tipo_calculo":"UN","unidade_medida":"UN","preco_unitario":67.5,"taxa_plaina_padrao":0,"estoque_atual":45,"estoque_minimo":10,"ativo":true},
  {"id":"prod_391","codigo":"MAT-391","nome":"FECHADURA BANHEIRO RES SOAVE 32 ES MACANETA ALAVANCA (716B112CR)","categoria":"Ferragens & Cercas","especie":"Aço Galvanizado","tipo_calculo":"UN","unidade_medida":"UN","preco_unitario":67.5,"taxa_plaina_padrao":0,"estoque_atual":45,"estoque_minimo":10,"ativo":true},
  {"id":"prod_392","codigo":"MAT-392","nome":"FECHADURA CROMADA INT. OU EXT. 3F (730I124OX)","categoria":"Ferragens & Cercas","especie":"Aço Galvanizado","tipo_calculo":"UN","unidade_medida":"UN","preco_unitario":64.5,"taxa_plaina_padrao":0,"estoque_atual":45,"estoque_minimo":10,"ativo":true},
  {"id":"prod_393","codigo":"MAT-393","nome":"FECHADURA INT. OU EXT. ALAVACA INOX MGM / 3F (716I112CR)","categoria":"Ferragens & Cercas","especie":"Aço Galvanizado","tipo_calculo":"UN","unidade_medida":"UN","preco_unitario":81,"taxa_plaina_padrao":0,"estoque_atual":45,"estoque_minimo":10,"ativo":true},
  {"id":"prod_394","codigo":"MAT-394","nome":"FECHADURA PORTA ALIANÇA INTERNA EXT.","categoria":"Ferragens & Cercas","especie":"Aço Galvanizado","tipo_calculo":"UN","unidade_medida":"UN","preco_unitario":63.6,"taxa_plaina_padrao":0,"estoque_atual":45,"estoque_minimo":10,"ativo":true},
  {"id":"prod_395","codigo":"MAT-395","nome":"FERROLHO FIO REDONDO LEVE 2\" 1 PÇ","categoria":"Ferragens & Cercas","especie":"Aço Galvanizado","tipo_calculo":"UN","unidade_medida":"UN","preco_unitario":12.6,"taxa_plaina_padrao":0,"estoque_atual":45,"estoque_minimo":10,"ativo":true},
  {"id":"prod_396","codigo":"MAT-396","nome":"FERROLHO REDONDO N°3","categoria":"Ferragens & Cercas","especie":"Aço Galvanizado","tipo_calculo":"UN","unidade_medida":"UN","preco_unitario":8.8,"taxa_plaina_padrao":0,"estoque_atual":45,"estoque_minimo":10,"ativo":true},
  {"id":"prod_397","codigo":"MAT-397","nome":"FERROLHO REDONDO Nº2","categoria":"Ferragens & Cercas","especie":"Aço Galvanizado","tipo_calculo":"UN","unidade_medida":"UN","preco_unitario":9.75,"taxa_plaina_padrao":0,"estoque_atual":45,"estoque_minimo":10,"ativo":true},
  {"id":"prod_398","codigo":"A-306","nome":"FERROLHO REDONDO Nº4","categoria":"Ferragens & Cercas","especie":"Aço Galvanizado","tipo_calculo":"UN","unidade_medida":"UN","preco_unitario":8.8,"taxa_plaina_padrao":0,"estoque_atual":45,"estoque_minimo":10,"ativo":true},
  {"id":"prod_399","codigo":"MAT-399","nome":"FIO DE NYLON TOYAMA 3,0 MM QUADRADO","categoria":"Ferramentas & Acessórios","especie":"Aço / Ferramental","tipo_calculo":"UN","unidade_medida":"UN","preco_unitario":1.7,"taxa_plaina_padrao":0,"estoque_atual":25,"estoque_minimo":5,"ativo":true},
  {"id":"prod_400","codigo":"MAT-400","nome":"FIO DE NYLON TOYAMA 3,0 MM QUADRADO BOBINA 2,268 KG 255 MTS","categoria":"Ferramentas & Acessórios","especie":"Aço / Ferramental","tipo_calculo":"UN","unidade_medida":"UN","preco_unitario":294,"taxa_plaina_padrao":0,"estoque_atual":25,"estoque_minimo":5,"ativo":true},
  {"id":"prod_401","codigo":"1-308","nome":"FIO ROÇADEIRA 3,0MM (P/MT)","categoria":"Ferramentas & Acessórios","especie":"Aço / Ferramental","tipo_calculo":"ML","unidade_medida":"ML","preco_unitario":1.8,"taxa_plaina_padrao":0,"estoque_atual":25,"estoque_minimo":5,"ativo":true,"comprimentos_comuns":[2.5,3,3.5,4]},
  {"id":"prod_402","codigo":"1-309","nome":"FITA ALTA FUSÃO 2M SCOTCH 3M (UNID)","categoria":"EPIs, Cordas & Diversos","especie":"Diversos","tipo_calculo":"UN","unidade_medida":"UN","preco_unitario":18,"taxa_plaina_padrao":0,"estoque_atual":40,"estoque_minimo":10,"ativo":true},
  {"id":"prod_403","codigo":"1-310","nome":"FITA CREPE 18 MM X 50 MM ADELBRÁS","categoria":"EPIs, Cordas & Diversos","especie":"Diversos","tipo_calculo":"UN","unidade_medida":"UN","preco_unitario":5.4,"taxa_plaina_padrao":0,"estoque_atual":40,"estoque_minimo":10,"ativo":true},
  {"id":"prod_404","codigo":"1-311","nome":"FITA DUPLA FACE TRANSPARENTE 19MM X 2M","categoria":"EPIs, Cordas & Diversos","especie":"Diversos","tipo_calculo":"UN","unidade_medida":"UN","preco_unitario":13.2,"taxa_plaina_padrao":0,"estoque_atual":40,"estoque_minimo":10,"ativo":true},
  {"id":"prod_405","codigo":"MAT-405","nome":"FITA ISOLANTE 10 M X 18MM IMPERIAL 3M","categoria":"EPIs, Cordas & Diversos","especie":"Diversos","tipo_calculo":"UN","unidade_medida":"UN","preco_unitario":6.8,"taxa_plaina_padrao":0,"estoque_atual":40,"estoque_minimo":10,"ativo":true},
  {"id":"prod_406","codigo":"1-312","nome":"FITA ISOLANTE 10M IMPERIAL 3M (UNID)","categoria":"EPIs, Cordas & Diversos","especie":"Diversos","tipo_calculo":"UN","unidade_medida":"UN","preco_unitario":7.35,"taxa_plaina_padrao":0,"estoque_atual":40,"estoque_minimo":10,"ativo":true},
  {"id":"prod_407","codigo":"MAT-407","nome":"FITA ISOLANTE 20 M X 18MM IMPERIAL 3M","categoria":"EPIs, Cordas & Diversos","especie":"Diversos","tipo_calculo":"UN","unidade_medida":"UN","preco_unitario":12,"taxa_plaina_padrao":0,"estoque_atual":40,"estoque_minimo":10,"ativo":true},
  {"id":"prod_408","codigo":"1-313","nome":"FITA ISOLANTE 20M IMPERIAL 3M (UNID)","categoria":"EPIs, Cordas & Diversos","especie":"Diversos","tipo_calculo":"UN","unidade_medida":"UN","preco_unitario":13.05,"taxa_plaina_padrao":0,"estoque_atual":40,"estoque_minimo":10,"ativo":true},
  {"id":"prod_409","codigo":"MAT-409","nome":"FITA ISOLANTE 2M X 19MM AUTO-FUSÃO 3M","categoria":"EPIs, Cordas & Diversos","especie":"Diversos","tipo_calculo":"UN","unidade_medida":"UN","preco_unitario":12,"taxa_plaina_padrao":0,"estoque_atual":40,"estoque_minimo":10,"ativo":true},
  {"id":"prod_410","codigo":"MAT-410","nome":"FITA ISOLANTE 5 M X 18MM IMPERIAL 3M","categoria":"EPIs, Cordas & Diversos","especie":"Diversos","tipo_calculo":"UN","unidade_medida":"UN","preco_unitario":3.4,"taxa_plaina_padrao":0,"estoque_atual":40,"estoque_minimo":10,"ativo":true},
  {"id":"prod_411","codigo":"1-314","nome":"FITA ISOLANTE 5M IMPERIAL 3M (UNID)","categoria":"EPIs, Cordas & Diversos","especie":"Diversos","tipo_calculo":"UN","unidade_medida":"UN","preco_unitario":4.5,"taxa_plaina_padrao":0,"estoque_atual":40,"estoque_minimo":10,"ativo":true},
  {"id":"prod_412","codigo":"1-315","nome":"FITA MANTA ASFÁLTICA SIKA 10CM X 10M","categoria":"EPIs, Cordas & Diversos","especie":"Diversos","tipo_calculo":"UN","unidade_medida":"UN","preco_unitario":28.35,"taxa_plaina_padrao":0,"estoque_atual":40,"estoque_minimo":10,"ativo":true},
  {"id":"prod_413","codigo":"1-316","nome":"FITA MANTA ASFÁLTICA SIKA 20CM X 10M","categoria":"EPIs, Cordas & Diversos","especie":"Diversos","tipo_calculo":"UN","unidade_medida":"UN","preco_unitario":60,"taxa_plaina_padrao":0,"estoque_atual":40,"estoque_minimo":10,"ativo":true},
  {"id":"prod_414","codigo":"1-317","nome":"FITA P/EMBALAGEM MARROM 45MM X 45MT","categoria":"EPIs, Cordas & Diversos","especie":"Diversos","tipo_calculo":"UN","unidade_medida":"UN","preco_unitario":6.9,"taxa_plaina_padrao":0,"estoque_atual":40,"estoque_minimo":10,"ativo":true},
  {"id":"prod_415","codigo":"1-318","nome":"FITA P/EMBALAGEM TRANSPARENTE 45MM X 45MT","categoria":"EPIs, Cordas & Diversos","especie":"Diversos","tipo_calculo":"UN","unidade_medida":"UN","preco_unitario":8.9,"taxa_plaina_padrao":0,"estoque_atual":40,"estoque_minimo":10,"ativo":true},
  {"id":"prod_416","codigo":"MAT-416","nome":"FITA VADATUDO RL 10 X 10M","categoria":"EPIs, Cordas & Diversos","especie":"Diversos","tipo_calculo":"UN","unidade_medida":"UN","preco_unitario":36,"taxa_plaina_padrao":0,"estoque_atual":40,"estoque_minimo":10,"ativo":true},
  {"id":"prod_417","codigo":"MAT-417","nome":"FITA VADATUDO RL 15 X 10M","categoria":"EPIs, Cordas & Diversos","especie":"Diversos","tipo_calculo":"UN","unidade_medida":"UN","preco_unitario":47.6,"taxa_plaina_padrao":0,"estoque_atual":40,"estoque_minimo":10,"ativo":true},
  {"id":"prod_418","codigo":"1-319","nome":"FITA VEDA ROSCA FIRLON 12MM X 5M","categoria":"Hidráulica & Conexões","especie":"PVC / Metal","tipo_calculo":"UN","unidade_medida":"UN","preco_unitario":2.2,"taxa_plaina_padrao":0,"estoque_atual":70,"estoque_minimo":20,"ativo":true},
  {"id":"prod_419","codigo":"1-320","nome":"FITA VEDA ROSCA FIRLON 12X10M","categoria":"Hidráulica & Conexões","especie":"PVC / Metal","tipo_calculo":"UN","unidade_medida":"UN","preco_unitario":3.2,"taxa_plaina_padrao":0,"estoque_atual":70,"estoque_minimo":20,"ativo":true},
  {"id":"prod_420","codigo":"1-321","nome":"FITA VEDA ROSCA FIRLON 18MM X 25M","categoria":"Hidráulica & Conexões","especie":"PVC / Metal","tipo_calculo":"UN","unidade_medida":"UN","preco_unitario":6.2,"taxa_plaina_padrao":0,"estoque_atual":70,"estoque_minimo":20,"ativo":true},
  {"id":"prod_421","codigo":"1-322","nome":"FITA ZEBRADA PRETO/AMARELO 200 MT PLASTCOR","categoria":"EPIs, Cordas & Diversos","especie":"Diversos","tipo_calculo":"UN","unidade_medida":"UN","preco_unitario":17.9,"taxa_plaina_padrao":0,"estoque_atual":40,"estoque_minimo":10,"ativo":true},
  {"id":"prod_422","codigo":"1-323","nome":"FITILHO ROLO","categoria":"EPIs, Cordas & Diversos","especie":"Diversos","tipo_calculo":"UN","unidade_medida":"UN","preco_unitario":18.9,"taxa_plaina_padrao":0,"estoque_atual":40,"estoque_minimo":10,"ativo":true},
  {"id":"prod_423","codigo":"1-305","nome":"FLANGE MARRON 25MM 3/4 KRONA","categoria":"Hidráulica & Conexões","especie":"PVC / Metal","tipo_calculo":"UN","unidade_medida":"UN","preco_unitario":12,"taxa_plaina_padrao":0,"estoque_atual":70,"estoque_minimo":20,"ativo":true},
  {"id":"prod_424","codigo":"1-306","nome":"FLANGE MARRON 50MM KORNA","categoria":"Hidráulica & Conexões","especie":"PVC / Metal","tipo_calculo":"UN","unidade_medida":"UN","preco_unitario":29.7,"taxa_plaina_padrao":0,"estoque_atual":70,"estoque_minimo":20,"ativo":true},
  {"id":"prod_425","codigo":"1-324","nome":"FOICE ABERTA CABO - FUZIL","categoria":"Ferramentas & Acessórios","especie":"Aço / Ferramental","tipo_calculo":"UN","unidade_medida":"UN","preco_unitario":97.5,"taxa_plaina_padrao":0,"estoque_atual":25,"estoque_minimo":5,"ativo":true},
  {"id":"prod_426","codigo":"1-325","nome":"FOICE ABERTA S/ CABO BELLOTO","categoria":"Ferramentas & Acessórios","especie":"Aço / Ferramental","tipo_calculo":"UN","unidade_medida":"UN","preco_unitario":119,"taxa_plaina_padrao":0,"estoque_atual":25,"estoque_minimo":5,"ativo":true},
  {"id":"prod_427","codigo":"MAT-427","nome":"FOICE RONCA ABERTA LEVE SEM CABO - FUZIL","categoria":"Ferramentas & Acessórios","especie":"Aço / Ferramental","tipo_calculo":"UN","unidade_medida":"UN","preco_unitario":97.5,"taxa_plaina_padrao":0,"estoque_atual":25,"estoque_minimo":5,"ativo":true},
  {"id":"prod_428","codigo":"1-326","nome":"FOICE ROÇADEIRA TRAMONTINA","categoria":"Ferramentas & Acessórios","especie":"Aço / Ferramental","tipo_calculo":"UN","unidade_medida":"UN","preco_unitario":75,"taxa_plaina_padrao":0,"estoque_atual":25,"estoque_minimo":5,"ativo":true},
  {"id":"prod_429","codigo":"1-327","nome":"FORMÃO PACETTA 1/4","categoria":"Ferramentas & Acessórios","especie":"Aço / Ferramental","tipo_calculo":"UN","unidade_medida":"UN","preco_unitario":22,"taxa_plaina_padrao":0,"estoque_atual":25,"estoque_minimo":5,"ativo":true},
  {"id":"prod_430","codigo":"1-328","nome":"FORMÃO PACETTA 3/8","categoria":"Ferramentas & Acessórios","especie":"Aço / Ferramental","tipo_calculo":"UN","unidade_medida":"UN","preco_unitario":24,"taxa_plaina_padrao":0,"estoque_atual":25,"estoque_minimo":5,"ativo":true},
  {"id":"prod_431","codigo":"1-329","nome":"FORMÃO PACETTA 5/8","categoria":"Ferramentas & Acessórios","especie":"Aço / Ferramental","tipo_calculo":"UN","unidade_medida":"UN","preco_unitario":36,"taxa_plaina_padrao":0,"estoque_atual":25,"estoque_minimo":5,"ativo":true},
  {"id":"prod_432","codigo":"MAT-432","nome":"FORRO MEIA CANA BARRA 6 MTS BRANCA","categoria":"Forros & Acabamentos","especie":"Diversos","tipo_calculo":"UN","unidade_medida":"UN","preco_unitario":70.5,"taxa_plaina_padrao":0,"estoque_atual":40,"estoque_minimo":10,"ativo":true},
  {"id":"prod_433","codigo":"MAT-433","nome":"FORRO MEIA CANA BARRA 6 MTS MARFIM E JACARANDA","categoria":"Forros & Acabamentos","especie":"Diversos","tipo_calculo":"UN","unidade_medida":"UN","preco_unitario":82.5,"taxa_plaina_padrao":0,"estoque_atual":40,"estoque_minimo":10,"ativo":true},
  {"id":"prod_434","codigo":"MAT-434","nome":"FORRO MEIA CANA PINUS 3 MT","categoria":"Forros & Acabamentos","especie":"Pinus","tipo_calculo":"UN","unidade_medida":"UN","preco_unitario":15,"taxa_plaina_padrao":0,"estoque_atual":40,"estoque_minimo":10,"ativo":true},
  {"id":"prod_435","codigo":"MAT-435","nome":"FORRO MEIA CANA PINUS TRATADO 3 M PREÇO P/ MT LINEAR","categoria":"Forros & Acabamentos","especie":"Pinus","tipo_calculo":"ML","unidade_medida":"ML","preco_unitario":24,"taxa_plaina_padrao":0,"estoque_atual":40,"estoque_minimo":10,"ativo":true,"comprimentos_comuns":[2.5,3,3.5,4]},
  {"id":"prod_436","codigo":"MAT-436","nome":"FORRO MEIA CANA PVC 6 MTS BRANCO","categoria":"Forros & Acabamentos","especie":"PVC","tipo_calculo":"UN","unidade_medida":"UN","preco_unitario":55.5,"taxa_plaina_padrao":0,"estoque_atual":40,"estoque_minimo":10,"ativo":true},
  {"id":"prod_437","codigo":"MAT-437","nome":"FORRO PINUS 3M PACOTE 4,50 M³ 15 PÇ","categoria":"Forros & Acabamentos","especie":"Pinus","tipo_calculo":"M2","unidade_medida":"M²","preco_unitario":49.5,"taxa_plaina_padrao":0,"estoque_atual":40,"estoque_minimo":10,"ativo":true},
  {"id":"prod_438","codigo":"MAT-438","nome":"FORRO PINUS 3M POR PEÇA","categoria":"Forros & Acabamentos","especie":"Pinus","tipo_calculo":"UN","unidade_medida":"UN","preco_unitario":21.6,"taxa_plaina_padrao":0,"estoque_atual":0,"estoque_minimo":10,"ativo":true},
  {"id":"prod_439","codigo":"MAT-439","nome":"FORRO PINUS TRATADO 10 CM 3 M PC COM 4,50 M³ PREÇO P/ MT QUADRADO","categoria":"Forros & Acabamentos","especie":"Pinus","tipo_calculo":"M2","unidade_medida":"M²","preco_unitario":89,"taxa_plaina_padrao":0,"estoque_atual":40,"estoque_minimo":10,"ativo":true},
  {"id":"prod_440","codigo":"MAT-440","nome":"FORRO PVC BRANCO GELO REGUA 200 MM X 3,50 (0,70 M²)","categoria":"Forros & Acabamentos","especie":"PVC","tipo_calculo":"M2","unidade_medida":"M²","preco_unitario":38.25,"taxa_plaina_padrao":0,"estoque_atual":40,"estoque_minimo":10,"ativo":true},
  {"id":"prod_441","codigo":"MAT-441","nome":"FORRO PVC JACARANDA  REGUA 200 MM X 4 M (0,80 M²)","categoria":"Forros & Acabamentos","especie":"PVC","tipo_calculo":"M2","unidade_medida":"M²","preco_unitario":56.7,"taxa_plaina_padrao":0,"estoque_atual":40,"estoque_minimo":10,"ativo":true},
  {"id":"prod_442","codigo":"MAT-442","nome":"FORRO PVC MARFIM REGUA 200 MM X 5 M (1,00 M²)","categoria":"Forros & Acabamentos","especie":"PVC","tipo_calculo":"M2","unidade_medida":"M²","preco_unitario":56.7,"taxa_plaina_padrao":0,"estoque_atual":40,"estoque_minimo":10,"ativo":true},
  {"id":"prod_443","codigo":"MAT-443","nome":"FORRO U ACABAMENTO 6 MTS BRANCO","categoria":"Forros & Acabamentos","especie":"Diversos","tipo_calculo":"UN","unidade_medida":"UN","preco_unitario":45,"taxa_plaina_padrao":0,"estoque_atual":40,"estoque_minimo":10,"ativo":true},
  {"id":"prod_444","codigo":"MAT-444","nome":"FORRO U ACABAMENTO 6 MTS MARFIM E JACARANDA","categoria":"Forros & Acabamentos","especie":"Diversos","tipo_calculo":"UN","unidade_medida":"UN","preco_unitario":82.5,"taxa_plaina_padrao":0,"estoque_atual":40,"estoque_minimo":10,"ativo":true},
  {"id":"prod_445","codigo":"1-337","nome":"FURADEIRA IMPACTO 1/2 MAKITA","categoria":"Ferramentas & Acessórios","especie":"Aço / Ferramental","tipo_calculo":"UN","unidade_medida":"UN","preco_unitario":447,"taxa_plaina_padrao":0,"estoque_atual":25,"estoque_minimo":5,"ativo":true},
  {"id":"prod_446","codigo":"MAT-446","nome":"GANCHO P/ REDE O PAR","categoria":"Ferragens & Cercas","especie":"Aço Galvanizado","tipo_calculo":"UN","unidade_medida":"UN","preco_unitario":24,"taxa_plaina_padrao":0,"estoque_atual":45,"estoque_minimo":10,"ativo":true},
  {"id":"prod_447","codigo":"1-339","nome":"GANCHO REDE SILVANA O PAR","categoria":"Ferragens & Cercas","especie":"Aço Galvanizado","tipo_calculo":"UN","unidade_medida":"UN","preco_unitario":37.8,"taxa_plaina_padrao":0,"estoque_atual":45,"estoque_minimo":10,"ativo":true},
  {"id":"prod_448","codigo":"1-","nome":"GANCHO S/ BUCHA JOMARCA","categoria":"Ferragens & Cercas","especie":"Aço Galvanizado","tipo_calculo":"UN","unidade_medida":"UN","preco_unitario":0.6,"taxa_plaina_padrao":0,"estoque_atual":45,"estoque_minimo":10,"ativo":true},
  {"id":"prod_449","codigo":"1-340","nome":"GARFO P/ROLO 23 CM C/BUCHA COMPEL","categoria":"Ferramentas & Acessórios","especie":"Aço / Ferramental","tipo_calculo":"UN","unidade_medida":"UN","preco_unitario":5.7,"taxa_plaina_padrao":0,"estoque_atual":25,"estoque_minimo":5,"ativo":true},
  {"id":"prod_450","codigo":"1-341","nome":"GARRAFÃO TERMICO 5,0 LITROS INVICTA","categoria":"EPIs, Cordas & Diversos","especie":"Diversos","tipo_calculo":"UN","unidade_medida":"UN","preco_unitario":45,"taxa_plaina_padrao":0,"estoque_atual":40,"estoque_minimo":10,"ativo":true},
  {"id":"prod_451","codigo":"1-345","nome":"GRAMPO EMENDA P/ MADEIRA 30 CM CADA","categoria":"Fixação & Pregos","especie":"Aço","tipo_calculo":"UN","unidade_medida":"UN","preco_unitario":48,"taxa_plaina_padrao":0,"estoque_atual":120,"estoque_minimo":30,"ativo":true},
  {"id":"prod_452","codigo":"1-344","nome":"GRAMPO EMENDA P/ MADEIRA 40 CM CADA","categoria":"Fixação & Pregos","especie":"Aço","tipo_calculo":"UN","unidade_medida":"UN","preco_unitario":51,"taxa_plaina_padrao":0,"estoque_atual":120,"estoque_minimo":30,"ativo":true},
  {"id":"prod_453","codigo":"1-342","nome":"GRAMPO MIGUELÃO  RIBEIRO MODELO 10-12 C/ 15 PÇS","categoria":"Fixação & Pregos","especie":"Aço","tipo_calculo":"UN","unidade_medida":"UN","preco_unitario":3.9,"taxa_plaina_padrao":0,"estoque_atual":120,"estoque_minimo":30,"ativo":true},
  {"id":"prod_454","codigo":"1-343","nome":"GRAMPO MIGUELÃO  RIBEIRO PREGO GALVANIZADO C/ 15 PÇS","categoria":"Fixação & Pregos","especie":"Aço","tipo_calculo":"UN","unidade_medida":"UN","preco_unitario":2.7,"taxa_plaina_padrao":0,"estoque_atual":120,"estoque_minimo":30,"ativo":true},
  {"id":"prod_455","codigo":"MAT-455","nome":"GRAMPOS P/ GRAMPEADORES 6 MM (MTX) C/ 1000 PÇ","categoria":"Fixação & Pregos","especie":"Aço","tipo_calculo":"UN","unidade_medida":"UN","preco_unitario":4.5,"taxa_plaina_padrao":0,"estoque_atual":120,"estoque_minimo":30,"ativo":true},
  {"id":"prod_456","codigo":"MAT-456","nome":"GRANULADO RATO 100 GRAMA","categoria":"EPIs, Cordas & Diversos","especie":"Diversos","tipo_calculo":"UN","unidade_medida":"UN","preco_unitario":30,"taxa_plaina_padrao":0,"estoque_atual":40,"estoque_minimo":10,"ativo":true},
  {"id":"prod_457","codigo":"MAT-457","nome":"GUARNIÇÃO 5 CM P/ BATENTE (PAR)","categoria":"Madeiras & Esquadrias","especie":"Diversos","tipo_calculo":"UN","unidade_medida":"UN","preco_unitario":75.8,"taxa_plaina_padrao":0,"estoque_atual":15,"estoque_minimo":5,"ativo":true},
  {"id":"prod_458","codigo":"1-346","nome":"GUARNIÇÃO 5 CM P/ BATENTE O PAR","categoria":"Madeiras & Esquadrias","especie":"Diversos","tipo_calculo":"UN","unidade_medida":"UN","preco_unitario":85.5,"taxa_plaina_padrao":0,"estoque_atual":15,"estoque_minimo":5,"ativo":true},
  {"id":"prod_459","codigo":"1-338","nome":"GÁS REFIL MAÇARICO 400 ML","categoria":"Tintas & Química","especie":"Químico","tipo_calculo":"UN","unidade_medida":"UN","preco_unitario":21.6,"taxa_plaina_padrao":0,"estoque_atual":35,"estoque_minimo":10,"ativo":true},
  {"id":"prod_460","codigo":"1-347","nome":"JOELHO 1/2 PRETO INTERNO DUPLO PLASBOHN PÇ","categoria":"Hidráulica & Conexões","especie":"PVC / Metal","tipo_calculo":"UN","unidade_medida":"UN","preco_unitario":1.8,"taxa_plaina_padrao":0,"estoque_atual":70,"estoque_minimo":20,"ativo":true},
  {"id":"prod_461","codigo":"1-348","nome":"JOELHO 3/4 PRETO INTERNO DUPLO PLASBOHN PÇ","categoria":"Hidráulica & Conexões","especie":"PVC / Metal","tipo_calculo":"UN","unidade_medida":"UN","preco_unitario":2.1,"taxa_plaina_padrao":0,"estoque_atual":70,"estoque_minimo":20,"ativo":true},
  {"id":"prod_462","codigo":"1-349","nome":"JOELHO 45 ESG 100MM PLASTUBOS","categoria":"Hidráulica & Conexões","especie":"PVC / Metal","tipo_calculo":"UN","unidade_medida":"UN","preco_unitario":7.8,"taxa_plaina_padrao":0,"estoque_atual":70,"estoque_minimo":20,"ativo":true},
  {"id":"prod_463","codigo":"1-350","nome":"JOELHO 45 ESG 50MM PLASTUBOS","categoria":"Hidráulica & Conexões","especie":"PVC / Metal","tipo_calculo":"UN","unidade_medida":"UN","preco_unitario":3.8,"taxa_plaina_padrao":0,"estoque_atual":70,"estoque_minimo":20,"ativo":true},
  {"id":"prod_464","codigo":"1-351","nome":"JOELHO 45 SOLD 25MM PLASTUBOS","categoria":"Hidráulica & Conexões","especie":"PVC / Metal","tipo_calculo":"UN","unidade_medida":"UN","preco_unitario":2,"taxa_plaina_padrao":0,"estoque_atual":70,"estoque_minimo":20,"ativo":true},
  {"id":"prod_465","codigo":"1-352","nome":"JOELHO 45 SOLD 50MM PLASTUBOS","categoria":"Hidráulica & Conexões","especie":"PVC / Metal","tipo_calculo":"UN","unidade_medida":"UN","preco_unitario":7.4,"taxa_plaina_padrao":0,"estoque_atual":70,"estoque_minimo":20,"ativo":true},
  {"id":"prod_466","codigo":"1-353","nome":"JOELHO 90 ESG 100MM PLASTUBOS","categoria":"Hidráulica & Conexões","especie":"PVC / Metal","tipo_calculo":"UN","unidade_medida":"UN","preco_unitario":6.4,"taxa_plaina_padrao":0,"estoque_atual":70,"estoque_minimo":20,"ativo":true},
  {"id":"prod_467","codigo":"1-354","nome":"JOELHO 90 ESG 50MM PLASTUBOS","categoria":"Hidráulica & Conexões","especie":"PVC / Metal","tipo_calculo":"UN","unidade_medida":"UN","preco_unitario":2.7,"taxa_plaina_padrao":0,"estoque_atual":70,"estoque_minimo":20,"ativo":true},
  {"id":"prod_468","codigo":"1-355","nome":"JOELHO 90 ESG C/VISITA 100X50MM PLASTUBOS","categoria":"Hidráulica & Conexões","especie":"PVC / Metal","tipo_calculo":"UN","unidade_medida":"UN","preco_unitario":23.4,"taxa_plaina_padrao":0,"estoque_atual":70,"estoque_minimo":20,"ativo":true},
  {"id":"prod_469","codigo":"1-356","nome":"JOELHO 90 SOLD 25MM PLASTUBOS","categoria":"Hidráulica & Conexões","especie":"PVC / Metal","tipo_calculo":"UN","unidade_medida":"UN","preco_unitario":0.8,"taxa_plaina_padrao":0,"estoque_atual":70,"estoque_minimo":20,"ativo":true},
  {"id":"prod_470","codigo":"1-357","nome":"JOELHO 90 SOLD 50MM PLASTUBOS","categoria":"Hidráulica & Conexões","especie":"PVC / Metal","tipo_calculo":"UN","unidade_medida":"UN","preco_unitario":4.2,"taxa_plaina_padrao":0,"estoque_atual":70,"estoque_minimo":20,"ativo":true},
  {"id":"prod_471","codigo":"1-358","nome":"JOELHO AZUL 90 SOLD  C/ROSCA 20 X 1/2","categoria":"Hidráulica & Conexões","especie":"PVC / Metal","tipo_calculo":"UN","unidade_medida":"UN","preco_unitario":3.8,"taxa_plaina_padrao":0,"estoque_atual":70,"estoque_minimo":20,"ativo":true},
  {"id":"prod_472","codigo":"1-359","nome":"JOELHO AZUL 90 SOLD/ROSCA 25MMX1/2 PLASTUBOS","categoria":"Hidráulica & Conexões","especie":"PVC / Metal","tipo_calculo":"UN","unidade_medida":"UN","preco_unitario":4.8,"taxa_plaina_padrao":0,"estoque_atual":70,"estoque_minimo":20,"ativo":true},
  {"id":"prod_473","codigo":"1-360","nome":"JOELHO AZUL 90 SOLD/ROSCA 25MMX3/4 PLASTUBOS","categoria":"Hidráulica & Conexões","especie":"PVC / Metal","tipo_calculo":"UN","unidade_medida":"UN","preco_unitario":6.4,"taxa_plaina_padrao":0,"estoque_atual":70,"estoque_minimo":20,"ativo":true},
  {"id":"prod_474","codigo":"1-361","nome":"JOGO BROCAS AÇO RAPIDO METAL 5 PÇ","categoria":"Utilidades Gerais","especie":"Aço","tipo_calculo":"UN","unidade_medida":"UN","preco_unitario":31.8,"taxa_plaina_padrao":0,"estoque_atual":40,"estoque_minimo":10,"ativo":true},
  {"id":"prod_475","codigo":"1-362","nome":"JOGO CHAVE ALLEN CURTA 1,5-10MM 9 PÇS","categoria":"Utilidades Gerais","especie":"Diversos","tipo_calculo":"UN","unidade_medida":"UN","preco_unitario":22.4,"taxa_plaina_padrao":0,"estoque_atual":40,"estoque_minimo":10,"ativo":true},
  {"id":"prod_476","codigo":"1-363","nome":"JOGO CHAVE ALLEN LONGA 1,5-10MM 9 PÇS","categoria":"Utilidades Gerais","especie":"Diversos","tipo_calculo":"UN","unidade_medida":"UN","preco_unitario":31,"taxa_plaina_padrao":0,"estoque_atual":40,"estoque_minimo":10,"ativo":true},
  {"id":"prod_477","codigo":"1-364","nome":"JOGO CHAVES COMBINADA 6 PÇS 8/10/12/13/15/17","categoria":"Utilidades Gerais","especie":"Diversos","tipo_calculo":"UN","unidade_medida":"UN","preco_unitario":48,"taxa_plaina_padrao":0,"estoque_atual":40,"estoque_minimo":10,"ativo":true},
  {"id":"prod_478","codigo":"1-365","nome":"JOGO LIMA ROTATIVA 5 PÇ (MTX)","categoria":"Utilidades Gerais","especie":"Diversos","tipo_calculo":"UN","unidade_medida":"UN","preco_unitario":27,"taxa_plaina_padrao":0,"estoque_atual":40,"estoque_minimo":10,"ativo":true},
  {"id":"prod_479","codigo":"1-366","nome":"JOGO TORX CURTA TC/ GUIA 9 PÇS","categoria":"Utilidades Gerais","especie":"Diversos","tipo_calculo":"UN","unidade_medida":"UN","preco_unitario":30,"taxa_plaina_padrao":0,"estoque_atual":40,"estoque_minimo":10,"ativo":true},
  {"id":"prod_480","codigo":"1-367","nome":"JOGO TORX LONGA TC/ GUIA 9 PÇS","categoria":"Utilidades Gerais","especie":"Diversos","tipo_calculo":"UN","unidade_medida":"UN","preco_unitario":40.5,"taxa_plaina_padrao":0,"estoque_atual":40,"estoque_minimo":10,"ativo":true},
  {"id":"prod_481","codigo":"1-368","nome":"JOGO TORX MEDIA TC/ GUIA 9 PÇS","categoria":"Utilidades Gerais","especie":"Diversos","tipo_calculo":"UN","unidade_medida":"UN","preco_unitario":36,"taxa_plaina_padrao":0,"estoque_atual":40,"estoque_minimo":10,"ativo":true},
  {"id":"prod_482","codigo":"1-369","nome":"JUNCÃO SIMPLES ESG 100X100MM PLASTUBOS","categoria":"Hidráulica & Conexões","especie":"PVC / Metal","tipo_calculo":"UN","unidade_medida":"UN","preco_unitario":25.2,"taxa_plaina_padrao":0,"estoque_atual":70,"estoque_minimo":20,"ativo":true},
  {"id":"prod_483","codigo":"1-370","nome":"JUNCÃO SIMPLES ESG 100X50MM PLASTUBOS","categoria":"Hidráulica & Conexões","especie":"PVC / Metal","tipo_calculo":"UN","unidade_medida":"UN","preco_unitario":15.6,"taxa_plaina_padrao":0,"estoque_atual":70,"estoque_minimo":20,"ativo":true},
  {"id":"prod_484","codigo":"1-371","nome":"KIT ACESSÓRIO P/ BANHEIRO","categoria":"Construção & Alvenaria","especie":"Diversos","tipo_calculo":"UN","unidade_medida":"UN","preco_unitario":58.5,"taxa_plaina_padrao":0,"estoque_atual":8,"estoque_minimo":2,"ativo":true},
  {"id":"prod_485","codigo":"1-372","nome":"KIT BROCA AÇO","categoria":"Utilidades Gerais","especie":"Aço","tipo_calculo":"UN","unidade_medida":"UN","preco_unitario":28.5,"taxa_plaina_padrao":0,"estoque_atual":40,"estoque_minimo":10,"ativo":true},
  {"id":"prod_486","codigo":"1-373","nome":"KIT BROCA MADEIRA","categoria":"Utilidades Gerais","especie":"Diversos","tipo_calculo":"UN","unidade_medida":"UN","preco_unitario":15,"taxa_plaina_padrao":0,"estoque_atual":40,"estoque_minimo":10,"ativo":true},
  {"id":"prod_487","codigo":"1-374","nome":"KIT BROCA WIDEA CONCRETO","categoria":"Utilidades Gerais","especie":"Concreto","tipo_calculo":"UN","unidade_medida":"UN","preco_unitario":22.5,"taxa_plaina_padrao":0,"estoque_atual":40,"estoque_minimo":10,"ativo":true},
  {"id":"prod_488","codigo":"1-375","nome":"KIT CAIXA DESCARGA ACIONAD SUPERIO SIMPLES CIVITT","categoria":"Hidráulica & Conexões","especie":"PVC / Metal","tipo_calculo":"UN","unidade_medida":"UN","preco_unitario":108,"taxa_plaina_padrao":0,"estoque_atual":70,"estoque_minimo":20,"ativo":true},
  {"id":"prod_489","codigo":"1-376","nome":"KIT CAIXA DESCARGA DUPLA ACIONAMENTO CIVITT","categoria":"Hidráulica & Conexões","especie":"PVC / Metal","tipo_calculo":"UN","unidade_medida":"UN","preco_unitario":120,"taxa_plaina_padrao":0,"estoque_atual":70,"estoque_minimo":20,"ativo":true},
  {"id":"prod_490","codigo":"MAT-490","nome":"KIT SERRA COPO 6 PEÇAS","categoria":"Utilidades Gerais","especie":"Diversos","tipo_calculo":"UN","unidade_medida":"UN","preco_unitario":28.2,"taxa_plaina_padrao":0,"estoque_atual":40,"estoque_minimo":10,"ativo":true},
  {"id":"prod_491","codigo":"1-377","nome":"LAMINA 2 PONTAS TOYAMA COMP 350 MM FURO 20.0/25 4MM E ESP 2,0MM","categoria":"Ferramentas & Acessórios","especie":"Aço / Ferramental","tipo_calculo":"UN","unidade_medida":"UN","preco_unitario":34.5,"taxa_plaina_padrao":0,"estoque_atual":25,"estoque_minimo":5,"ativo":true},
  {"id":"prod_492","codigo":"1-378","nome":"LAMINA 2 PONTAS TOYAMA COMP 350 MM FURO 20.0MM E ESP 1,7MM","categoria":"Ferramentas & Acessórios","especie":"Aço / Ferramental","tipo_calculo":"UN","unidade_medida":"UN","preco_unitario":30,"taxa_plaina_padrao":0,"estoque_atual":25,"estoque_minimo":5,"ativo":true},
  {"id":"prod_493","codigo":"1-379","nome":"LAMINA 26 DENTES VIDEA TOYAMA 25,4/20 MM ESP 1,6MM","categoria":"Ferramentas & Acessórios","especie":"Aço / Ferramental","tipo_calculo":"UN","unidade_medida":"UN","preco_unitario":59.4,"taxa_plaina_padrao":0,"estoque_atual":25,"estoque_minimo":5,"ativo":true},
  {"id":"prod_494","codigo":"1-380","nome":"LAMINA 40 DENTES VIDEA TOYAMA 20/25MM ESP 2,0MM/1,3 MM","categoria":"Ferramentas & Acessórios","especie":"Aço / Ferramental","tipo_calculo":"UN","unidade_medida":"UN","preco_unitario":54.4,"taxa_plaina_padrao":0,"estoque_atual":25,"estoque_minimo":5,"ativo":true},
  {"id":"prod_495","codigo":"1-381","nome":"LAMINA FACA CORT. COURO STARRETC","categoria":"Ferramentas & Acessórios","especie":"Aço / Ferramental","tipo_calculo":"UN","unidade_medida":"UN","preco_unitario":7.6,"taxa_plaina_padrao":0,"estoque_atual":25,"estoque_minimo":5,"ativo":true},
  {"id":"prod_496","codigo":"1-382","nome":"LAMINA P/ ROÇADEIRAS 350MM FURO 1\" X 2,0 MM DURALINE UNIVERSAL","categoria":"Ferramentas & Acessórios","especie":"Aço / Ferramental","tipo_calculo":"UN","unidade_medida":"UN","preco_unitario":29.8,"taxa_plaina_padrao":0,"estoque_atual":25,"estoque_minimo":5,"ativo":true},
  {"id":"prod_497","codigo":"1-383","nome":"LAMPADA LED MEGA LUMI 12W BIVOLT 127/220 V BRANCA FRIA","categoria":"Elétrica & Iluminação","especie":"Cobre / Termoplástico","tipo_calculo":"UN","unidade_medida":"UN","preco_unitario":11.8,"taxa_plaina_padrao":0,"estoque_atual":55,"estoque_minimo":15,"ativo":true},
  {"id":"prod_498","codigo":"1-384","nome":"LAMPADA LED MEGA LUMI 15W BIVOLT 127/220 V BRANCA FRIA","categoria":"Elétrica & Iluminação","especie":"Cobre / Termoplástico","tipo_calculo":"UN","unidade_medida":"UN","preco_unitario":16,"taxa_plaina_padrao":0,"estoque_atual":55,"estoque_minimo":15,"ativo":true},
  {"id":"prod_499","codigo":"1-385","nome":"LAMPADA LED MEGA LUMI 9W BIVOLT 127/220 V BRANCA FRIA","categoria":"Elétrica & Iluminação","especie":"Cobre / Termoplástico","tipo_calculo":"UN","unidade_medida":"UN","preco_unitario":9.6,"taxa_plaina_padrao":0,"estoque_atual":55,"estoque_minimo":15,"ativo":true},
  {"id":"prod_500","codigo":"1-386","nome":"LAMPIÃO LED C/ LANTERNA SOLAR E BIVOLT","categoria":"Elétrica & Iluminação","especie":"Cobre / Termoplástico","tipo_calculo":"UN","unidade_medida":"UN","preco_unitario":45,"taxa_plaina_padrao":0,"estoque_atual":55,"estoque_minimo":15,"ativo":true},
  {"id":"prod_501","codigo":"1-387","nome":"LANTERNA RECARREGÁVEL 5 LED BIVOLT","categoria":"Elétrica & Iluminação","especie":"Cobre / Termoplástico","tipo_calculo":"UN","unidade_medida":"UN","preco_unitario":36,"taxa_plaina_padrao":0,"estoque_atual":55,"estoque_minimo":15,"ativo":true},
  {"id":"prod_502","codigo":"1-388","nome":"LAPIS CARPINTEIRO (UNID) 72","categoria":"Ferramentas & Acessórios","especie":"Aço / Ferramental","tipo_calculo":"UN","unidade_medida":"UN","preco_unitario":3.2,"taxa_plaina_padrao":0,"estoque_atual":25,"estoque_minimo":5,"ativo":true},
  {"id":"prod_503","codigo":"MAT-503","nome":"LAPIS CARPINTEIRO EMBAL. C/ 72 PÇ","categoria":"Ferramentas & Acessórios","especie":"Aço / Ferramental","tipo_calculo":"UN","unidade_medida":"UN","preco_unitario":2.5,"taxa_plaina_padrao":0,"estoque_atual":25,"estoque_minimo":5,"ativo":true},
  {"id":"prod_504","codigo":"1-389","nome":"LAVATORIO MEDIO 45X39 CM BRANCO ARAXA STA CLARA","categoria":"Construção & Alvenaria","especie":"Diversos","tipo_calculo":"UN","unidade_medida":"UN","preco_unitario":133,"taxa_plaina_padrao":0,"estoque_atual":8,"estoque_minimo":2,"ativo":true},
  {"id":"prod_505","codigo":"1-390","nome":"LIMA ENXADA 08 ESPECIAL - FUZIL","categoria":"Ferramentas & Acessórios","especie":"Aço / Ferramental","tipo_calculo":"UN","unidade_medida":"UN","preco_unitario":14.9,"taxa_plaina_padrao":0,"estoque_atual":25,"estoque_minimo":5,"ativo":true},
  {"id":"prod_506","codigo":"1-391","nome":"LIMA ENXADA 08 KF CHATA C/CB","categoria":"Ferramentas & Acessórios","especie":"Aço / Ferramental","tipo_calculo":"UN","unidade_medida":"UN","preco_unitario":19,"taxa_plaina_padrao":0,"estoque_atual":25,"estoque_minimo":5,"ativo":true},
  {"id":"prod_507","codigo":"1-392","nome":"LIMA P/ ENXADA 8 KF C/CB","categoria":"Ferramentas & Acessórios","especie":"Aço / Ferramental","tipo_calculo":"UN","unidade_medida":"UN","preco_unitario":21,"taxa_plaina_padrao":0,"estoque_atual":25,"estoque_minimo":5,"ativo":true},
  {"id":"prod_508","codigo":"1-393","nome":"LIMA P/ MOTOSSERRA 8 3/16 KF FINA","categoria":"Ferramentas & Acessórios","especie":"Aço / Ferramental","tipo_calculo":"UN","unidade_medida":"UN","preco_unitario":12,"taxa_plaina_padrao":0,"estoque_atual":25,"estoque_minimo":5,"ativo":true},
  {"id":"prod_509","codigo":"1-394","nome":"LIMA P/ MOTOSSERRA 8 7/32 KF GROSSA","categoria":"Ferramentas & Acessórios","especie":"Aço / Ferramental","tipo_calculo":"UN","unidade_medida":"UN","preco_unitario":12,"taxa_plaina_padrao":0,"estoque_atual":25,"estoque_minimo":5,"ativo":true},
  {"id":"prod_510","codigo":"1-395","nome":"LIMPA PEDRA 1L MAZA","categoria":"Tintas & Química","especie":"Químico","tipo_calculo":"UN","unidade_medida":"UN","preco_unitario":17.2,"taxa_plaina_padrao":0,"estoque_atual":35,"estoque_minimo":10,"ativo":true},
  {"id":"prod_511","codigo":"1-396","nome":"LIMPINHO DESINCRUSTATE ÁCIDO 1 LITRO","categoria":"Tintas & Química","especie":"Químico","tipo_calculo":"UN","unidade_medida":"UN","preco_unitario":12.9,"taxa_plaina_padrao":0,"estoque_atual":35,"estoque_minimo":10,"ativo":true},
  {"id":"prod_512","codigo":"1-397","nome":"LIMPINHO DESINCRUSTATE ÁCIDO 5 LITRO","categoria":"Tintas & Química","especie":"Químico","tipo_calculo":"UN","unidade_medida":"UN","preco_unitario":43.5,"taxa_plaina_padrao":0,"estoque_atual":35,"estoque_minimo":10,"ativo":true},
  {"id":"prod_513","codigo":"1-398","nome":"LINHA PEDREIRO 100 M ROSSI","categoria":"Ferramentas & Acessórios","especie":"Aço / Ferramental","tipo_calculo":"UN","unidade_medida":"UN","preco_unitario":15.6,"taxa_plaina_padrao":0,"estoque_atual":25,"estoque_minimo":5,"ativo":true},
  {"id":"prod_514","codigo":"1-399","nome":"LINHA PEDREIRO 50 M ROSSI","categoria":"Ferramentas & Acessórios","especie":"Aço / Ferramental","tipo_calculo":"UN","unidade_medida":"UN","preco_unitario":9,"taxa_plaina_padrao":0,"estoque_atual":25,"estoque_minimo":5,"ativo":true},
  {"id":"prod_515","codigo":"1-400","nome":"LIXA AGUA Nº100 NORTON","categoria":"Ferramentas & Acessórios","especie":"Aço / Ferramental","tipo_calculo":"UN","unidade_medida":"UN","preco_unitario":3.2,"taxa_plaina_padrao":0,"estoque_atual":25,"estoque_minimo":5,"ativo":true},
  {"id":"prod_516","codigo":"1-401","nome":"LIXA AGUA Nº220 NORTON","categoria":"Ferramentas & Acessórios","especie":"Aço / Ferramental","tipo_calculo":"UN","unidade_medida":"UN","preco_unitario":3.2,"taxa_plaina_padrao":0,"estoque_atual":25,"estoque_minimo":5,"ativo":true},
  {"id":"prod_517","codigo":"1-402","nome":"LIXA FERRO/AÇO GRÃO 120","categoria":"Ferramentas & Acessórios","especie":"Aço","tipo_calculo":"UN","unidade_medida":"UN","preco_unitario":2.2,"taxa_plaina_padrao":0,"estoque_atual":25,"estoque_minimo":5,"ativo":true},
  {"id":"prod_518","codigo":"1-403","nome":"LIXA FERRO/AÇO GRÃO 60","categoria":"Ferramentas & Acessórios","especie":"Aço","tipo_calculo":"UN","unidade_medida":"UN","preco_unitario":3.8,"taxa_plaina_padrao":0,"estoque_atual":25,"estoque_minimo":5,"ativo":true},
  {"id":"prod_519","codigo":"1-404","nome":"LIXA MASSA VERM Nº100 NORTON","categoria":"Ferramentas & Acessórios","especie":"Aço / Ferramental","tipo_calculo":"UN","unidade_medida":"UN","preco_unitario":1.6,"taxa_plaina_padrao":0,"estoque_atual":25,"estoque_minimo":5,"ativo":true},
  {"id":"prod_520","codigo":"1-405","nome":"LIXA MASSA VERM Nº220 NORTON","categoria":"Ferramentas & Acessórios","especie":"Aço / Ferramental","tipo_calculo":"UN","unidade_medida":"UN","preco_unitario":1.6,"taxa_plaina_padrao":0,"estoque_atual":25,"estoque_minimo":5,"ativo":true},
  {"id":"prod_521","codigo":"1-406","nome":"LIXA MASSA VERM Nº60 NORTON","categoria":"Ferramentas & Acessórios","especie":"Aço / Ferramental","tipo_calculo":"UN","unidade_medida":"UN","preco_unitario":2.2,"taxa_plaina_padrao":0,"estoque_atual":25,"estoque_minimo":5,"ativo":true},
  {"id":"prod_522","codigo":"1-407","nome":"LIXEIRA CALÇADA GALVANIZADA 60X45CM ALT. 1,20 MT","categoria":"EPIs, Cordas & Diversos","especie":"Diversos","tipo_calculo":"UN","unidade_medida":"UN","preco_unitario":195,"taxa_plaina_padrao":0,"estoque_atual":40,"estoque_minimo":10,"ativo":true},
  {"id":"prod_523","codigo":"1-408","nome":"LONA LEVE AZUL 06X06 LOCOMOTIVA F.1","categoria":"EPIs, Cordas & Diversos","especie":"Diversos","tipo_calculo":"UN","unidade_medida":"UN","preco_unitario":396,"taxa_plaina_padrao":0,"estoque_atual":40,"estoque_minimo":10,"ativo":true},
  {"id":"prod_524","codigo":"1-409","nome":"LONA PRETA 4X110 (METRO)","categoria":"EPIs, Cordas & Diversos","especie":"Diversos","tipo_calculo":"ML","unidade_medida":"ML","preco_unitario":18.8,"taxa_plaina_padrao":0,"estoque_atual":40,"estoque_minimo":10,"ativo":true,"comprimentos_comuns":[2.5,3,3.5,4]},
  {"id":"prod_525","codigo":"1-410","nome":"LUB FAST DESENGRIPANTE 300 ML","categoria":"Tintas & Química","especie":"Químico","tipo_calculo":"UN","unidade_medida":"UN","preco_unitario":13.2,"taxa_plaina_padrao":0,"estoque_atual":35,"estoque_minimo":10,"ativo":true},
  {"id":"prod_526","codigo":"1-411","nome":"LUVA AZUL SOLD/ROSCA 20 MM X 1/2","categoria":"Hidráulica & Conexões","especie":"PVC / Metal","tipo_calculo":"UN","unidade_medida":"UN","preco_unitario":4.9,"taxa_plaina_padrao":0,"estoque_atual":70,"estoque_minimo":20,"ativo":true},
  {"id":"prod_527","codigo":"1-412","nome":"LUVA AZUL SOLD/ROSCA 20 MM X 3/4","categoria":"Hidráulica & Conexões","especie":"PVC / Metal","tipo_calculo":"UN","unidade_medida":"UN","preco_unitario":4.8,"taxa_plaina_padrao":0,"estoque_atual":70,"estoque_minimo":20,"ativo":true},
  {"id":"prod_528","codigo":"1-413","nome":"LUVA CORRER P/TUBO ESG 100MM PLASTUBOS","categoria":"Hidráulica & Conexões","especie":"PVC / Metal","tipo_calculo":"UN","unidade_medida":"UN","preco_unitario":17.6,"taxa_plaina_padrao":0,"estoque_atual":70,"estoque_minimo":20,"ativo":true},
  {"id":"prod_529","codigo":"1-414","nome":"LUVA CORRER P/TUBO ESG 50MM PLASTUBOS","categoria":"Hidráulica & Conexões","especie":"PVC / Metal","tipo_calculo":"UN","unidade_medida":"UN","preco_unitario":12.4,"taxa_plaina_padrao":0,"estoque_atual":70,"estoque_minimo":20,"ativo":true},
  {"id":"prod_530","codigo":"1-415","nome":"LUVA CORRER P/TUBO SOLD 25MM PLASTUBOS","categoria":"Hidráulica & Conexões","especie":"PVC / Metal","tipo_calculo":"UN","unidade_medida":"UN","preco_unitario":14.2,"taxa_plaina_padrao":0,"estoque_atual":70,"estoque_minimo":20,"ativo":true},
  {"id":"prod_531","codigo":"1-416","nome":"LUVA CORRER P/TUBO SOLD 50MM PLASTUBOS","categoria":"Hidráulica & Conexões","especie":"PVC / Metal","tipo_calculo":"UN","unidade_medida":"UN","preco_unitario":30.6,"taxa_plaina_padrao":0,"estoque_atual":70,"estoque_minimo":20,"ativo":true},
  {"id":"prod_532","codigo":"1-417","nome":"LUVA SIMPLES ESG 100MM PLASTUBOS","categoria":"Hidráulica & Conexões","especie":"PVC / Metal","tipo_calculo":"UN","unidade_medida":"UN","preco_unitario":6.5,"taxa_plaina_padrao":0,"estoque_atual":70,"estoque_minimo":20,"ativo":true},
  {"id":"prod_533","codigo":"1-418","nome":"LUVA SIMPLES ESG 50MM PLASTUBOS","categoria":"Hidráulica & Conexões","especie":"PVC / Metal","tipo_calculo":"UN","unidade_medida":"UN","preco_unitario":3.3,"taxa_plaina_padrao":0,"estoque_atual":70,"estoque_minimo":20,"ativo":true},
  {"id":"prod_534","codigo":"1-419","nome":"LUVA SOLD 25MM PLASTUBOS","categoria":"Hidráulica & Conexões","especie":"PVC / Metal","tipo_calculo":"UN","unidade_medida":"UN","preco_unitario":0.9,"taxa_plaina_padrao":0,"estoque_atual":70,"estoque_minimo":20,"ativo":true},
  {"id":"prod_535","codigo":"1-420","nome":"LUVA SOLD 50MM PLASTUBOS","categoria":"Hidráulica & Conexões","especie":"PVC / Metal","tipo_calculo":"UN","unidade_medida":"UN","preco_unitario":4.5,"taxa_plaina_padrao":0,"estoque_atual":70,"estoque_minimo":20,"ativo":true},
  {"id":"prod_536","codigo":"MAT-536","nome":"LUVA TRIC. BANHADA VER. SUPER SAFETY","categoria":"Hidráulica & Conexões","especie":"PVC / Metal","tipo_calculo":"UN","unidade_medida":"UN","preco_unitario":18,"taxa_plaina_padrao":0,"estoque_atual":70,"estoque_minimo":20,"ativo":true},
  {"id":"prod_537","codigo":"1-421","nome":"LUVA TRIC. BANHADA VER. SUPER SAFETY (PAR)","categoria":"Hidráulica & Conexões","especie":"PVC / Metal","tipo_calculo":"UN","unidade_medida":"UN","preco_unitario":16,"taxa_plaina_padrao":0,"estoque_atual":70,"estoque_minimo":20,"ativo":true},
  {"id":"prod_538","codigo":"1-423","nome":"MACHADINHA C/ CABO EM FIBRA DE VIDRO THOMPSON","categoria":"Ferramentas & Acessórios","especie":"Aço / Ferramental","tipo_calculo":"UN","unidade_medida":"UN","preco_unitario":81,"taxa_plaina_padrao":0,"estoque_atual":25,"estoque_minimo":5,"ativo":true},
  {"id":"prod_539","codigo":"1-424","nome":"MACHADINHA C/ UNHA CABO MADEIRA","categoria":"Ferramentas & Acessórios","especie":"Aço / Ferramental","tipo_calculo":"UN","unidade_medida":"UN","preco_unitario":42,"taxa_plaina_padrao":0,"estoque_atual":25,"estoque_minimo":5,"ativo":true},
  {"id":"prod_540","codigo":"1-425","nome":"MACHADO 3.5 LIBRAS COM CABO - FUZIL","categoria":"Ferramentas & Acessórios","especie":"Aço / Ferramental","tipo_calculo":"UN","unidade_medida":"UN","preco_unitario":152,"taxa_plaina_padrao":0,"estoque_atual":25,"estoque_minimo":5,"ativo":true},
  {"id":"prod_541","codigo":"1-426","nome":"MACHADO C/ CABO IRMÃO WENZEL","categoria":"Ferramentas & Acessórios","especie":"Aço / Ferramental","tipo_calculo":"UN","unidade_medida":"UN","preco_unitario":234.6,"taxa_plaina_padrao":0,"estoque_atual":25,"estoque_minimo":5,"ativo":true},
  {"id":"prod_542","codigo":"1-429","nome":"MADERITE PALST. PRETO 110X220 10MM","categoria":"Madeiras & Esquadrias","especie":"Diversos","tipo_calculo":"UN","unidade_medida":"UN","preco_unitario":113.4,"taxa_plaina_padrao":0,"estoque_atual":15,"estoque_minimo":5,"ativo":true},
  {"id":"prod_543","codigo":"1-430","nome":"MADERITE PLAST. PRETO 110X220 17MM","categoria":"Madeiras & Esquadrias","especie":"Diversos","tipo_calculo":"UN","unidade_medida":"UN","preco_unitario":168,"taxa_plaina_padrao":0,"estoque_atual":15,"estoque_minimo":5,"ativo":true},
  {"id":"prod_544","codigo":"MAT-544","nome":"MADERITE PLASTIFICADO PRETO 110X220 ESP. 10MM","categoria":"Madeiras & Esquadrias","especie":"Diversos","tipo_calculo":"UN","unidade_medida":"UN","preco_unitario":104,"taxa_plaina_padrao":0,"estoque_atual":15,"estoque_minimo":5,"ativo":true},
  {"id":"prod_545","codigo":"MAT-545","nome":"MADERITE PLASTIFICADO PRETO 110X220 ESP. 17MM","categoria":"Madeiras & Esquadrias","especie":"Diversos","tipo_calculo":"UN","unidade_medida":"UN","preco_unitario":158.4,"taxa_plaina_padrao":0,"estoque_atual":15,"estoque_minimo":5,"ativo":true},
  {"id":"prod_546","codigo":"MAT-546","nome":"MADERITE RESINADA VERMELHO 1,10X2,20 5 MM","categoria":"Madeiras & Esquadrias","especie":"Diversos","tipo_calculo":"UN","unidade_medida":"UN","preco_unitario":32.2,"taxa_plaina_padrao":0,"estoque_atual":15,"estoque_minimo":5,"ativo":true},
  {"id":"prod_547","codigo":"MAT-547","nome":"MADERITE RESINADA VERMELHO 1,10X2,20 9 MM","categoria":"Madeiras & Esquadrias","especie":"Diversos","tipo_calculo":"UN","unidade_medida":"UN","preco_unitario":62,"taxa_plaina_padrao":0,"estoque_atual":15,"estoque_minimo":5,"ativo":true},
  {"id":"prod_548","codigo":"1-431","nome":"MADERITE VERMELHO 110X220 5MM","categoria":"Madeiras & Esquadrias","especie":"Diversos","tipo_calculo":"UN","unidade_medida":"UN","preco_unitario":37.8,"taxa_plaina_padrao":0,"estoque_atual":15,"estoque_minimo":5,"ativo":true},
  {"id":"prod_549","codigo":"1-432","nome":"MADERITE VERMELHO 110X220 9MM","categoria":"Madeiras & Esquadrias","especie":"Diversos","tipo_calculo":"UN","unidade_medida":"UN","preco_unitario":62.4,"taxa_plaina_padrao":0,"estoque_atual":15,"estoque_minimo":5,"ativo":true},
  {"id":"prod_550","codigo":"1-433","nome":"MANGUEIRA AMARELA MEGAJATO 1/2\"","categoria":"Hidráulica & Conexões","especie":"PVC / Metal","tipo_calculo":"UN","unidade_medida":"UN","preco_unitario":6.2,"taxa_plaina_padrao":0,"estoque_atual":70,"estoque_minimo":20,"ativo":true},
  {"id":"prod_551","codigo":"1-434","nome":"MANGUEIRA NIVEL SILICONE 5/16 X 1.5 100 MT PLAST (METRO)","categoria":"Hidráulica & Conexões","especie":"PVC / Metal","tipo_calculo":"ML","unidade_medida":"ML","preco_unitario":3,"taxa_plaina_padrao":0,"estoque_atual":70,"estoque_minimo":20,"ativo":true,"comprimentos_comuns":[2.5,3,3.5,4]},
  {"id":"prod_552","codigo":"1-435","nome":"MANGUEIRA P/ QUINTAL ULTRAFORTE AZUL 1/2 X 200M","categoria":"Hidráulica & Conexões","especie":"PVC / Metal","tipo_calculo":"UN","unidade_medida":"UN","preco_unitario":8.8,"taxa_plaina_padrao":0,"estoque_atual":70,"estoque_minimo":20,"ativo":true},
  {"id":"prod_553","codigo":"1-436","nome":"MANGUEIRA PRETA 1/2X2,0MM ROLO 100M","categoria":"Hidráulica & Conexões","especie":"PVC / Metal","tipo_calculo":"UN","unidade_medida":"UN","preco_unitario":222,"taxa_plaina_padrao":0,"estoque_atual":70,"estoque_minimo":20,"ativo":true},
  {"id":"prod_554","codigo":"MAT-554","nome":"MANGUEIRA PRETA 1/2X2,0MM ROLO 100M PONTA VERMELHA","categoria":"Hidráulica & Conexões","especie":"PVC / Metal","tipo_calculo":"UN","unidade_medida":"UN","preco_unitario":206,"taxa_plaina_padrao":0,"estoque_atual":70,"estoque_minimo":20,"ativo":true},
  {"id":"prod_555","codigo":"1-437","nome":"MANGUEIRA PRETA 3/4 X 1,8 MM ROLO 100M X R$315,00","categoria":"Hidráulica & Conexões","especie":"PVC / Metal","tipo_calculo":"UN","unidade_medida":"UN","preco_unitario":4.2,"taxa_plaina_padrao":0,"estoque_atual":70,"estoque_minimo":20,"ativo":true},
  {"id":"prod_556","codigo":"1-438","nome":"MANGUEIRA PRETA 3/4 X 1,8 MM ROLO 50M","categoria":"Hidráulica & Conexões","especie":"PVC / Metal","tipo_calculo":"UN","unidade_medida":"UN","preco_unitario":94.5,"taxa_plaina_padrao":0,"estoque_atual":70,"estoque_minimo":20,"ativo":true},
  {"id":"prod_557","codigo":"MAT-557","nome":"MANGUEIRA PRETA 3/4X1,8MM ROLO 100M PONTA VERMELHA","categoria":"Hidráulica & Conexões","especie":"PVC / Metal","tipo_calculo":"UN","unidade_medida":"UN","preco_unitario":187.5,"taxa_plaina_padrao":0,"estoque_atual":70,"estoque_minimo":20,"ativo":true},
  {"id":"prod_558","codigo":"MAT-558","nome":"MANGUEIRA PRETA 3/4X1,8MM ROLO 50M PONTA VERMELHA","categoria":"Hidráulica & Conexões","especie":"PVC / Metal","tipo_calculo":"UN","unidade_medida":"UN","preco_unitario":94.5,"taxa_plaina_padrao":0,"estoque_atual":70,"estoque_minimo":20,"ativo":true},
  {"id":"prod_559","codigo":"1-439","nome":"MANGUEIRA USO GERAL RAFORÇADA P/ GÁS 4 MM X 50 MT","categoria":"Hidráulica & Conexões","especie":"PVC / Metal","tipo_calculo":"UN","unidade_medida":"UN","preco_unitario":7.82,"taxa_plaina_padrao":0,"estoque_atual":70,"estoque_minimo":20,"ativo":true},
  {"id":"prod_560","codigo":"MAT-560","nome":"MANGUEIRA USO GERAL RAFORÇADA P/ GÁS 4MM X 50 MT","categoria":"Hidráulica & Conexões","especie":"PVC / Metal","tipo_calculo":"UN","unidade_medida":"UN","preco_unitario":12,"taxa_plaina_padrao":0,"estoque_atual":70,"estoque_minimo":20,"ativo":true},
  {"id":"prod_561","codigo":"MAT-561","nome":"MARRETA 1 KG C/ CABO MINAS SUL","categoria":"Ferramentas & Acessórios","especie":"Aço / Ferramental","tipo_calculo":"UN","unidade_medida":"KG","preco_unitario":38.1,"taxa_plaina_padrao":0,"estoque_atual":25,"estoque_minimo":5,"ativo":true},
  {"id":"prod_562","codigo":"MAT-562","nome":"MARRETA 1,5 KG C/ CABO MINAS SUL","categoria":"Ferramentas & Acessórios","especie":"Aço / Ferramental","tipo_calculo":"UN","unidade_medida":"UN","preco_unitario":54.9,"taxa_plaina_padrao":0,"estoque_atual":25,"estoque_minimo":5,"ativo":true},
  {"id":"prod_563","codigo":"1-428","nome":"MARTELO TRAMONTINA Nº 27","categoria":"Ferramentas & Acessórios","especie":"Aço / Ferramental","tipo_calculo":"UN","unidade_medida":"UN","preco_unitario":45,"taxa_plaina_padrao":0,"estoque_atual":25,"estoque_minimo":5,"ativo":true},
  {"id":"prod_564","codigo":"1-427","nome":"MARTELO TRAMONTINA Nº 29","categoria":"Ferramentas & Acessórios","especie":"Aço / Ferramental","tipo_calculo":"UN","unidade_medida":"UN","preco_unitario":54,"taxa_plaina_padrao":0,"estoque_atual":25,"estoque_minimo":5,"ativo":true},
  {"id":"prod_565","codigo":"1-440","nome":"MASSA F 12 P/ MADEIRA VIAPOL 400 G CEREJERA / MOGNO/ YPE","categoria":"Tintas & Química","especie":"Químico","tipo_calculo":"UN","unidade_medida":"UN","preco_unitario":15,"taxa_plaina_padrao":0,"estoque_atual":35,"estoque_minimo":10,"ativo":true},
  {"id":"prod_566","codigo":"MAT-566","nome":"MATA CUPIM SAYERLACK 900 ML","categoria":"Tintas & Química","especie":"Químico","tipo_calculo":"UN","unidade_medida":"UN","preco_unitario":50.4,"taxa_plaina_padrao":0,"estoque_atual":35,"estoque_minimo":10,"ativo":true},
  {"id":"prod_567","codigo":"1-422","nome":"MAÇARICO GÁS PORTATIL THOMPSON","categoria":"Ferramentas & Acessórios","especie":"Aço / Ferramental","tipo_calculo":"UN","unidade_medida":"UN","preco_unitario":28.2,"taxa_plaina_padrao":0,"estoque_atual":25,"estoque_minimo":5,"ativo":true},
  {"id":"prod_568","codigo":"1-441","nome":"MEIA LUA 40 CM 3 FURO PAR","categoria":"Utilidades Gerais","especie":"Diversos","tipo_calculo":"UN","unidade_medida":"UN","preco_unitario":66,"taxa_plaina_padrao":0,"estoque_atual":40,"estoque_minimo":10,"ativo":true},
  {"id":"prod_569","codigo":"1-442","nome":"MEIA LUA 50 CM 3 FURO PAR","categoria":"Utilidades Gerais","especie":"Diversos","tipo_calculo":"UN","unidade_medida":"UN","preco_unitario":75,"taxa_plaina_padrao":0,"estoque_atual":40,"estoque_minimo":10,"ativo":true},
  {"id":"prod_570","codigo":"1-443","nome":"MEXEDOR DE TINTA FERRO 120X9X600 MM","categoria":"Tintas & Química","especie":"Químico","tipo_calculo":"UN","unidade_medida":"UN","preco_unitario":38.2,"taxa_plaina_padrao":0,"estoque_atual":35,"estoque_minimo":10,"ativo":true},
  {"id":"prod_571","codigo":"1-444","nome":"MEXEDOR DE TINTA FERRO 80X8X400 MM","categoria":"Tintas & Química","especie":"Químico","tipo_calculo":"UN","unidade_medida":"UN","preco_unitario":20.3,"taxa_plaina_padrao":0,"estoque_atual":35,"estoque_minimo":10,"ativo":true},
  {"id":"prod_572","codigo":"MAT-572","nome":"MOURÕES RACHADO 2,20 COMP. CADA R$15,00","categoria":"Madeiras & Esquadrias","especie":"Diversos","tipo_calculo":"UN","unidade_medida":"UN","preco_unitario":150,"taxa_plaina_padrao":0,"estoque_atual":15,"estoque_minimo":5,"ativo":true},
  {"id":"prod_573","codigo":"1-445","nome":"NEUTROL ASFALTICO VEDACIT 3,6 L","categoria":"Tintas & Química","especie":"Químico","tipo_calculo":"UN","unidade_medida":"UN","preco_unitario":153,"taxa_plaina_padrao":0,"estoque_atual":35,"estoque_minimo":10,"ativo":true},
  {"id":"prod_574","codigo":"MAT-574","nome":"NEUTROL TINTA ASFALTICO VEDACIT 3,6 L","categoria":"Tintas & Química","especie":"Químico","tipo_calculo":"UN","unidade_medida":"UN","preco_unitario":165.6,"taxa_plaina_padrao":0,"estoque_atual":35,"estoque_minimo":10,"ativo":true},
  {"id":"prod_575","codigo":"1-446","nome":"NIPEL ROSCA (A) 1/2 PLASTUBOS","categoria":"Hidráulica & Conexões","especie":"PVC / Metal","tipo_calculo":"UN","unidade_medida":"UN","preco_unitario":0.9,"taxa_plaina_padrao":0,"estoque_atual":70,"estoque_minimo":20,"ativo":true},
  {"id":"prod_576","codigo":"1-447","nome":"NIPEL ROSCA (B) 3/4 PLASTUBOS","categoria":"Hidráulica & Conexões","especie":"PVC / Metal","tipo_calculo":"UN","unidade_medida":"UN","preco_unitario":1.2,"taxa_plaina_padrao":0,"estoque_atual":70,"estoque_minimo":20,"ativo":true},
  {"id":"prod_577","codigo":"1-448","nome":"NIVEL 30 CM PROFICIONAL 123 BOLHAS","categoria":"Ferramentas & Acessórios","especie":"Aço / Ferramental","tipo_calculo":"UN","unidade_medida":"UN","preco_unitario":33,"taxa_plaina_padrao":0,"estoque_atual":25,"estoque_minimo":5,"ativo":true},
  {"id":"prod_578","codigo":"1-449","nome":"NIVEL ALUMINIO THOMPSON 3 BOLHAS  (30 CM )","categoria":"Ferramentas & Acessórios","especie":"Alumínio","tipo_calculo":"UN","unidade_medida":"UN","preco_unitario":19.5,"taxa_plaina_padrao":0,"estoque_atual":25,"estoque_minimo":5,"ativo":true},
  {"id":"prod_579","codigo":"1-450","nome":"NIVEL MADEIRA 30 CM THOMPSON","categoria":"Ferramentas & Acessórios","especie":"Aço / Ferramental","tipo_calculo":"UN","unidade_medida":"UN","preco_unitario":24.8,"taxa_plaina_padrao":0,"estoque_atual":25,"estoque_minimo":5,"ativo":true},
  {"id":"prod_580","codigo":"MAT-580","nome":"OLEO 2T 500 MLX20 CASTROL.MOTOR CHAINSAW","categoria":"Tintas & Química","especie":"Químico","tipo_calculo":"UN","unidade_medida":"UN","preco_unitario":27,"taxa_plaina_padrao":0,"estoque_atual":35,"estoque_minimo":10,"ativo":true},
  {"id":"prod_581","codigo":"1-452","nome":"OLEO CASTROL 2T","categoria":"Tintas & Química","especie":"Químico","tipo_calculo":"UN","unidade_medida":"UN","preco_unitario":42.6,"taxa_plaina_padrao":0,"estoque_atual":35,"estoque_minimo":10,"ativo":true},
  {"id":"prod_582","codigo":"1-454","nome":"PA CARVOEIRO S/CABO","categoria":"Ferramentas & Acessórios","especie":"Aço / Ferramental","tipo_calculo":"UN","unidade_medida":"UN","preco_unitario":105,"taxa_plaina_padrao":0,"estoque_atual":25,"estoque_minimo":5,"ativo":true},
  {"id":"prod_583","codigo":"MAT-583","nome":"PA DE BICO TRAMONTINA C/ CABO Nº4 / PEGUE E USE","categoria":"Ferramentas & Acessórios","especie":"Aço / Ferramental","tipo_calculo":"UN","unidade_medida":"UN","preco_unitario":45,"taxa_plaina_padrao":0,"estoque_atual":25,"estoque_minimo":5,"ativo":true},
  {"id":"prod_584","codigo":"MAT-584","nome":"PA QUADRADA TRAMONTINA C/CABO","categoria":"Ferramentas & Acessórios","especie":"Aço / Ferramental","tipo_calculo":"UN","unidade_medida":"UN","preco_unitario":46.5,"taxa_plaina_padrao":0,"estoque_atual":25,"estoque_minimo":5,"ativo":true},
  {"id":"prod_585","codigo":"MAT-585","nome":"PA QUADRADA TRAMONTINA C/CABO 120 CM","categoria":"Ferramentas & Acessórios","especie":"Aço / Ferramental","tipo_calculo":"UN","unidade_medida":"UN","preco_unitario":60,"taxa_plaina_padrao":0,"estoque_atual":25,"estoque_minimo":5,"ativo":true},
  {"id":"prod_586","codigo":"MAT-586","nome":"PA QUADRADA TRAMONTINA C/CABO 71 CM","categoria":"Ferramentas & Acessórios","especie":"Aço / Ferramental","tipo_calculo":"UN","unidade_medida":"UN","preco_unitario":45,"taxa_plaina_padrao":0,"estoque_atual":25,"estoque_minimo":5,"ativo":true},
  {"id":"prod_587","codigo":"MAT-587","nome":"PAPAEL CHAMEX A4 210X297 10X500","categoria":"EPIs, Cordas & Diversos","especie":"Diversos","tipo_calculo":"UN","unidade_medida":"UN","preco_unitario":34.5,"taxa_plaina_padrao":0,"estoque_atual":40,"estoque_minimo":10,"ativo":true},
  {"id":"prod_588","codigo":"MAT-588","nome":"PAQUIMETRO UNIVERSAL METALICO 150 MM","categoria":"Ferramentas & Acessórios","especie":"Aço / Ferramental","tipo_calculo":"UN","unidade_medida":"UN","preco_unitario":66.6,"taxa_plaina_padrao":0,"estoque_atual":25,"estoque_minimo":5,"ativo":true},
  {"id":"prod_589","codigo":"MAT-589","nome":"PARAFUSO  FRANCES C/ PORCA  1/4 X 2","categoria":"Fixação & Pregos","especie":"Aço","tipo_calculo":"UN","unidade_medida":"UN","preco_unitario":0.6,"taxa_plaina_padrao":0,"estoque_atual":120,"estoque_minimo":30,"ativo":true},
  {"id":"prod_590","codigo":"MAT-590","nome":"PARAFUSO  FRANCES C/ PORCA  1/4 X 2.1/2 - 100 PÇ","categoria":"Fixação & Pregos","especie":"Aço","tipo_calculo":"UN","unidade_medida":"UN","preco_unitario":0.6,"taxa_plaina_padrao":0,"estoque_atual":120,"estoque_minimo":30,"ativo":true},
  {"id":"prod_591","codigo":"MAT-591","nome":"PARAFUSO CHUP 3.5 X 25 - 500 PÇ","categoria":"Fixação & Pregos","especie":"Aço","tipo_calculo":"UN","unidade_medida":"UN","preco_unitario":0.3,"taxa_plaina_padrao":0,"estoque_atual":120,"estoque_minimo":30,"ativo":true},
  {"id":"prod_592","codigo":"MAT-592","nome":"PARAFUSO CHUP 3.5 X 30 - 500 PÇ","categoria":"Fixação & Pregos","especie":"Aço","tipo_calculo":"UN","unidade_medida":"UN","preco_unitario":0.3,"taxa_plaina_padrao":0,"estoque_atual":120,"estoque_minimo":30,"ativo":true},
  {"id":"prod_593","codigo":"MAT-593","nome":"PARAFUSO CHUP 3.5 X 35 - 500PÇ","categoria":"Fixação & Pregos","especie":"Aço","tipo_calculo":"UN","unidade_medida":"UN","preco_unitario":0.3,"taxa_plaina_padrao":0,"estoque_atual":120,"estoque_minimo":30,"ativo":true},
  {"id":"prod_594","codigo":"MAT-594","nome":"PARAFUSO CHUP 3.5 X 40 - 500 PÇ","categoria":"Fixação & Pregos","especie":"Aço","tipo_calculo":"UN","unidade_medida":"UN","preco_unitario":0.3,"taxa_plaina_padrao":0,"estoque_atual":120,"estoque_minimo":30,"ativo":true},
  {"id":"prod_595","codigo":"MAT-595","nome":"PARAFUSO CHUP 3.5X25 JOMARCA","categoria":"Fixação & Pregos","especie":"Aço","tipo_calculo":"UN","unidade_medida":"UN","preco_unitario":0.2,"taxa_plaina_padrao":0,"estoque_atual":120,"estoque_minimo":30,"ativo":true},
  {"id":"prod_596","codigo":"MAT-596","nome":"PARAFUSO CHUP 3.5X30 JOMARCA","categoria":"Fixação & Pregos","especie":"Aço","tipo_calculo":"UN","unidade_medida":"UN","preco_unitario":0.2,"taxa_plaina_padrao":0,"estoque_atual":120,"estoque_minimo":30,"ativo":true},
  {"id":"prod_597","codigo":"MAT-597","nome":"PARAFUSO CHUP 3.5X35 JOMARCA","categoria":"Fixação & Pregos","especie":"Aço","tipo_calculo":"UN","unidade_medida":"UN","preco_unitario":0.2,"taxa_plaina_padrao":0,"estoque_atual":120,"estoque_minimo":30,"ativo":true},
  {"id":"prod_598","codigo":"MAT-598","nome":"PARAFUSO CHUP 3.5X40 JOMARCA","categoria":"Fixação & Pregos","especie":"Aço","tipo_calculo":"UN","unidade_medida":"UN","preco_unitario":0.3,"taxa_plaina_padrao":0,"estoque_atual":120,"estoque_minimo":30,"ativo":true},
  {"id":"prod_599","codigo":"MAT-599","nome":"PARAFUSO CHUP 4.0 X 40 - 500 PÇ","categoria":"Fixação & Pregos","especie":"Aço","tipo_calculo":"UN","unidade_medida":"UN","preco_unitario":0.45,"taxa_plaina_padrao":0,"estoque_atual":120,"estoque_minimo":30,"ativo":true},
  {"id":"prod_600","codigo":"MAT-600","nome":"PARAFUSO CHUP 4.0 X 45 - 500 PÇ","categoria":"Fixação & Pregos","especie":"Aço","tipo_calculo":"UN","unidade_medida":"UN","preco_unitario":0.3,"taxa_plaina_padrao":0,"estoque_atual":120,"estoque_minimo":30,"ativo":true},
  {"id":"prod_601","codigo":"MAT-601","nome":"PARAFUSO CHUP 4.0 X 50 - 500 PÇ","categoria":"Fixação & Pregos","especie":"Aço","tipo_calculo":"UN","unidade_medida":"UN","preco_unitario":0.3,"taxa_plaina_padrao":0,"estoque_atual":120,"estoque_minimo":30,"ativo":true},
  {"id":"prod_602","codigo":"MAT-602","nome":"PARAFUSO CHUP 4.0X40 JOMARCA","categoria":"Fixação & Pregos","especie":"Aço","tipo_calculo":"UN","unidade_medida":"UN","preco_unitario":0.4,"taxa_plaina_padrao":0,"estoque_atual":120,"estoque_minimo":30,"ativo":true},
  {"id":"prod_603","codigo":"MAT-603","nome":"PARAFUSO CHUP 4.0X45 JOMARCA","categoria":"Fixação & Pregos","especie":"Aço","tipo_calculo":"UN","unidade_medida":"UN","preco_unitario":0.4,"taxa_plaina_padrao":0,"estoque_atual":120,"estoque_minimo":30,"ativo":true},
  {"id":"prod_604","codigo":"MAT-604","nome":"PARAFUSO CHUP 4.0X50 JOMARCA","categoria":"Fixação & Pregos","especie":"Aço","tipo_calculo":"UN","unidade_medida":"UN","preco_unitario":0.4,"taxa_plaina_padrao":0,"estoque_atual":120,"estoque_minimo":30,"ativo":true},
  {"id":"prod_605","codigo":"MAT-605","nome":"PARAFUSO CHUP 4.5 X 16 - 500PÇ","categoria":"Fixação & Pregos","especie":"Aço","tipo_calculo":"UN","unidade_medida":"UN","preco_unitario":0.2,"taxa_plaina_padrao":0,"estoque_atual":120,"estoque_minimo":30,"ativo":true},
  {"id":"prod_606","codigo":"MAT-606","nome":"PARAFUSO CHUP 4.5X16","categoria":"Fixação & Pregos","especie":"Aço","tipo_calculo":"UN","unidade_medida":"UN","preco_unitario":0.2,"taxa_plaina_padrao":0,"estoque_atual":120,"estoque_minimo":30,"ativo":true},
  {"id":"prod_607","codigo":"MAT-607","nome":"PARAFUSO CHUP 5.0 X 50","categoria":"Fixação & Pregos","especie":"Aço","tipo_calculo":"UN","unidade_medida":"UN","preco_unitario":0.25,"taxa_plaina_padrao":0,"estoque_atual":120,"estoque_minimo":30,"ativo":true},
  {"id":"prod_608","codigo":"MAT-608","nome":"PARAFUSO CHUP 5.0 X 50 - 200 PÇ","categoria":"Fixação & Pregos","especie":"Aço","tipo_calculo":"UN","unidade_medida":"UN","preco_unitario":0.45,"taxa_plaina_padrao":0,"estoque_atual":120,"estoque_minimo":30,"ativo":true},
  {"id":"prod_609","codigo":"MAT-609","nome":"PARAFUSO FRANCES C/ PORCA 1/4 X 1","categoria":"Fixação & Pregos","especie":"Aço","tipo_calculo":"UN","unidade_medida":"UN","preco_unitario":0.5,"taxa_plaina_padrao":0,"estoque_atual":120,"estoque_minimo":30,"ativo":true},
  {"id":"prod_610","codigo":"MAT-610","nome":"PARAFUSO FRANCES C/ PORCA 1/4 X 1 - 200 PÇ","categoria":"Fixação & Pregos","especie":"Aço","tipo_calculo":"UN","unidade_medida":"UN","preco_unitario":0.45,"taxa_plaina_padrao":0,"estoque_atual":120,"estoque_minimo":30,"ativo":true},
  {"id":"prod_611","codigo":"MAT-611","nome":"PARAFUSO FRANCES C/ PORCA 1/4 X 1.1/2 - 200 PÇ","categoria":"Fixação & Pregos","especie":"Aço","tipo_calculo":"UN","unidade_medida":"UN","preco_unitario":0.5,"taxa_plaina_padrao":0,"estoque_atual":120,"estoque_minimo":30,"ativo":true},
  {"id":"prod_612","codigo":"MAT-612","nome":"PARAFUSO FRANCES C/ PORCA 1/4 X 2 - 200 PÇ","categoria":"Fixação & Pregos","especie":"Aço","tipo_calculo":"UN","unidade_medida":"UN","preco_unitario":0.5,"taxa_plaina_padrao":0,"estoque_atual":120,"estoque_minimo":30,"ativo":true},
  {"id":"prod_613","codigo":"MAT-613","nome":"PARAFUSO FRANCES C/ PORCA 1/4 X 2 JOMARCA","categoria":"Fixação & Pregos","especie":"Aço","tipo_calculo":"UN","unidade_medida":"UN","preco_unitario":0.5,"taxa_plaina_padrao":0,"estoque_atual":120,"estoque_minimo":30,"ativo":true},
  {"id":"prod_614","codigo":"MAT-614","nome":"PARAFUSO FRANCES C/ PORCA 1/4 X 3/4 - 100 PÇ","categoria":"Fixação & Pregos","especie":"Aço","tipo_calculo":"UN","unidade_medida":"UN","preco_unitario":0.35,"taxa_plaina_padrao":0,"estoque_atual":120,"estoque_minimo":30,"ativo":true},
  {"id":"prod_615","codigo":"MAT-615","nome":"PARAFUSO FRANCES C/ PORCA 1/4 X 3/4 JOMARCA","categoria":"Fixação & Pregos","especie":"Aço","tipo_calculo":"UN","unidade_medida":"UN","preco_unitario":0.35,"taxa_plaina_padrao":0,"estoque_atual":120,"estoque_minimo":30,"ativo":true},
  {"id":"prod_616","codigo":"MAT-616","nome":"PARAFUSO FRANCES C/ PORCA 1/4 X 4 1/2 - 100 PÇ","categoria":"Fixação & Pregos","especie":"Aço","tipo_calculo":"UN","unidade_medida":"UN","preco_unitario":1,"taxa_plaina_padrao":0,"estoque_atual":120,"estoque_minimo":30,"ativo":true},
  {"id":"prod_617","codigo":"MAT-617","nome":"PARAFUSO FRANCES C/ PORCA 1/4X1 JOMARCA","categoria":"Fixação & Pregos","especie":"Aço","tipo_calculo":"UN","unidade_medida":"UN","preco_unitario":0.4,"taxa_plaina_padrao":0,"estoque_atual":120,"estoque_minimo":30,"ativo":true},
  {"id":"prod_618","codigo":"MAT-618","nome":"PARAFUSO FRANCES C/ PORCA 1/4X4 1/2 JOMARCA","categoria":"Fixação & Pregos","especie":"Aço","tipo_calculo":"UN","unidade_medida":"UN","preco_unitario":1,"taxa_plaina_padrao":0,"estoque_atual":120,"estoque_minimo":30,"ativo":true},
  {"id":"prod_619","codigo":"MAT-619","nome":"PARAFUSO FRANCES C/ PORCA 3/8X2 - 1/2 - 100 PÇ","categoria":"Fixação & Pregos","especie":"Aço","tipo_calculo":"UN","unidade_medida":"UN","preco_unitario":2.4,"taxa_plaina_padrao":0,"estoque_atual":120,"estoque_minimo":30,"ativo":true},
  {"id":"prod_620","codigo":"MAT-620","nome":"PARAFUSO FRANCES C/ PORCA 3/8X2.1/2 -","categoria":"Fixação & Pregos","especie":"Aço","tipo_calculo":"UN","unidade_medida":"UN","preco_unitario":2.6,"taxa_plaina_padrao":0,"estoque_atual":120,"estoque_minimo":30,"ativo":true},
  {"id":"prod_621","codigo":"MAT-621","nome":"PARAFUSO FRANCES C/ PORCA 3/8X5 - 1/2 - 100 PÇ","categoria":"Fixação & Pregos","especie":"Aço","tipo_calculo":"UN","unidade_medida":"UN","preco_unitario":3.4,"taxa_plaina_padrao":0,"estoque_atual":120,"estoque_minimo":30,"ativo":true},
  {"id":"prod_622","codigo":"MAT-622","nome":"PARAFUSO FRANCES C/ PORCA 3/8X6 - 50PÇ","categoria":"Fixação & Pregos","especie":"Aço","tipo_calculo":"UN","unidade_medida":"UN","preco_unitario":4.4,"taxa_plaina_padrao":0,"estoque_atual":120,"estoque_minimo":30,"ativo":true},
  {"id":"prod_623","codigo":"MAT-623","nome":"PARAFUSO FRANCES C/ PORCA 3/8X6 ZIN JOMARCA","categoria":"Fixação & Pregos","especie":"Aço","tipo_calculo":"UN","unidade_medida":"UN","preco_unitario":2.8,"taxa_plaina_padrao":0,"estoque_atual":120,"estoque_minimo":30,"ativo":true},
  {"id":"prod_624","codigo":"MAT-624","nome":"PARAFUSO FRANCES C/ PORCA 5/16X2 - 100 PÇ","categoria":"Fixação & Pregos","especie":"Aço","tipo_calculo":"UN","unidade_medida":"UN","preco_unitario":1.2,"taxa_plaina_padrao":0,"estoque_atual":120,"estoque_minimo":30,"ativo":true},
  {"id":"prod_625","codigo":"MAT-625","nome":"PARAFUSO FRANCES C/ PORCA 5/16X3 - 100 PÇ","categoria":"Fixação & Pregos","especie":"Aço","tipo_calculo":"UN","unidade_medida":"UN","preco_unitario":1.4,"taxa_plaina_padrao":0,"estoque_atual":120,"estoque_minimo":30,"ativo":true},
  {"id":"prod_626","codigo":"MAT-626","nome":"PARAFUSO FRANCES C/ PORCA 5/16X3 ZIN JOMARCA","categoria":"Fixação & Pregos","especie":"Aço","tipo_calculo":"UN","unidade_medida":"UN","preco_unitario":1.2,"taxa_plaina_padrao":0,"estoque_atual":120,"estoque_minimo":30,"ativo":true},
  {"id":"prod_627","codigo":"MAT-627","nome":"PARAFUSO FRANCES C/PORCA 1/4 X 4","categoria":"Fixação & Pregos","especie":"Aço","tipo_calculo":"UN","unidade_medida":"UN","preco_unitario":0.8,"taxa_plaina_padrao":0,"estoque_atual":120,"estoque_minimo":30,"ativo":true},
  {"id":"prod_628","codigo":"MAT-628","nome":"PARAFUSO FRANCES C/PORCA 1/4 X 4 JOMARCA","categoria":"Fixação & Pregos","especie":"Aço","tipo_calculo":"UN","unidade_medida":"UN","preco_unitario":0.8,"taxa_plaina_padrao":0,"estoque_atual":120,"estoque_minimo":30,"ativo":true},
  {"id":"prod_629","codigo":"MAT-629","nome":"PARAFUSO FRANCES C/PORCA 1/4X3","categoria":"Fixação & Pregos","especie":"Aço","tipo_calculo":"UN","unidade_medida":"UN","preco_unitario":0.6,"taxa_plaina_padrao":0,"estoque_atual":120,"estoque_minimo":30,"ativo":true},
  {"id":"prod_630","codigo":"MAT-630","nome":"PARAFUSO FRANCES C/PORCA 1/4X3 . 1/2","categoria":"Fixação & Pregos","especie":"Aço","tipo_calculo":"UN","unidade_medida":"UN","preco_unitario":0.8,"taxa_plaina_padrao":0,"estoque_atual":120,"estoque_minimo":30,"ativo":true},
  {"id":"prod_631","codigo":"MAT-631","nome":"PARAFUSO FRANCES C/PORCA 1/4X3 . 1/2 JOMARCA","categoria":"Fixação & Pregos","especie":"Aço","tipo_calculo":"UN","unidade_medida":"UN","preco_unitario":0.8,"taxa_plaina_padrao":0,"estoque_atual":120,"estoque_minimo":30,"ativo":true},
  {"id":"prod_632","codigo":"MAT-632","nome":"PARAFUSO FRANCES C/PORCA 3/8X3 - 100 PÇ","categoria":"Fixação & Pregos","especie":"Aço","tipo_calculo":"UN","unidade_medida":"UN","preco_unitario":3.3,"taxa_plaina_padrao":0,"estoque_atual":120,"estoque_minimo":30,"ativo":true},
  {"id":"prod_633","codigo":"MAT-633","nome":"PARAFUSO FRANCES ZINC C PORCA 3/8X2.1/2","categoria":"Fixação & Pregos","especie":"Aço","tipo_calculo":"UN","unidade_medida":"UN","preco_unitario":2.6,"taxa_plaina_padrao":0,"estoque_atual":120,"estoque_minimo":30,"ativo":true},
  {"id":"prod_634","codigo":"MAT-634","nome":"PARAFUSO FRANCES ZINC C/PORCA 1/4X3","categoria":"Fixação & Pregos","especie":"Aço","tipo_calculo":"UN","unidade_medida":"UN","preco_unitario":0.6,"taxa_plaina_padrao":0,"estoque_atual":120,"estoque_minimo":30,"ativo":true},
  {"id":"prod_635","codigo":"MAT-635","nome":"PARAFUSO FRANCES ZINC C/PORCA 3/8X3","categoria":"Fixação & Pregos","especie":"Aço","tipo_calculo":"UN","unidade_medida":"UN","preco_unitario":1.7,"taxa_plaina_padrao":0,"estoque_atual":120,"estoque_minimo":30,"ativo":true},
  {"id":"prod_636","codigo":"MAT-636","nome":"PARAFUSO FRANCES ZINC.  C/ PORCA 3/8X2 - 1/2 JAMARCA","categoria":"Fixação & Pregos","especie":"Aço","tipo_calculo":"UN","unidade_medida":"UN","preco_unitario":2.4,"taxa_plaina_padrao":0,"estoque_atual":120,"estoque_minimo":30,"ativo":true},
  {"id":"prod_637","codigo":"MAT-637","nome":"PARAFUSO FRANCES ZINC.  C/ PORCA 3/8X5 - 1/2 JAMARCA","categoria":"Fixação & Pregos","especie":"Aço","tipo_calculo":"UN","unidade_medida":"UN","preco_unitario":3.4,"taxa_plaina_padrao":0,"estoque_atual":120,"estoque_minimo":30,"ativo":true},
  {"id":"prod_638","codigo":"MAT-638","nome":"PARAFUSO FRANCES ZINC.  C/ PORCA 5/16X2 - 1/2 JAMARCA","categoria":"Fixação & Pregos","especie":"Aço","tipo_calculo":"UN","unidade_medida":"UN","preco_unitario":1,"taxa_plaina_padrao":0,"estoque_atual":120,"estoque_minimo":30,"ativo":true},
  {"id":"prod_639","codigo":"MAT-639","nome":"PARAFUSO FRANCES ZINC. C/PORCA  5/16X3 - JOMARCA","categoria":"Fixação & Pregos","especie":"Aço","tipo_calculo":"UN","unidade_medida":"UN","preco_unitario":1,"taxa_plaina_padrao":0,"estoque_atual":120,"estoque_minimo":30,"ativo":true},
  {"id":"prod_640","codigo":"MAT-640","nome":"PARAFUSO PARA TELHADO 110 MM CADA","categoria":"Fixação & Pregos","especie":"Aço","tipo_calculo":"UN","unidade_medida":"UN","preco_unitario":1.8,"taxa_plaina_padrao":0,"estoque_atual":120,"estoque_minimo":30,"ativo":true},
  {"id":"prod_641","codigo":"MAT-641","nome":"PARAFUSO PARA TELHADO 110MM","categoria":"Fixação & Pregos","especie":"Aço","tipo_calculo":"UN","unidade_medida":"UN","preco_unitario":1.5,"taxa_plaina_padrao":0,"estoque_atual":120,"estoque_minimo":30,"ativo":true},
  {"id":"prod_642","codigo":"MAT-642","nome":"PARAFUSO PARA TELHADO AUTO BROC. 125MM","categoria":"Fixação & Pregos","especie":"Aço","tipo_calculo":"UN","unidade_medida":"UN","preco_unitario":2.1,"taxa_plaina_padrao":0,"estoque_atual":120,"estoque_minimo":30,"ativo":true},
  {"id":"prod_643","codigo":"MAT-643","nome":"PARAFUSO SEXTAVADO 5/16X40 - 200PÇ","categoria":"Fixação & Pregos","especie":"Aço","tipo_calculo":"UN","unidade_medida":"UN","preco_unitario":0.75,"taxa_plaina_padrao":0,"estoque_atual":120,"estoque_minimo":30,"ativo":true},
  {"id":"prod_644","codigo":"MAT-644","nome":"PARAFUSO SEXTAVADO 5/16X60 - 100PÇ","categoria":"Fixação & Pregos","especie":"Aço","tipo_calculo":"UN","unidade_medida":"UN","preco_unitario":1.5,"taxa_plaina_padrao":0,"estoque_atual":120,"estoque_minimo":30,"ativo":true},
  {"id":"prod_645","codigo":"MAT-645","nome":"PARAFUSO SEXTAVADO 5/16X90 - 100 PÇ","categoria":"Fixação & Pregos","especie":"Aço","tipo_calculo":"UN","unidade_medida":"UN","preco_unitario":2.1,"taxa_plaina_padrao":0,"estoque_atual":120,"estoque_minimo":30,"ativo":true},
  {"id":"prod_646","codigo":"MAT-646","nome":"PARAFUSO SEXTAVADO AUT. BROK5,5X1 JOMARCA CX 200","categoria":"Fixação & Pregos","especie":"Aço","tipo_calculo":"UN","unidade_medida":"UN","preco_unitario":0.6,"taxa_plaina_padrao":0,"estoque_atual":120,"estoque_minimo":30,"ativo":true},
  {"id":"prod_647","codigo":"MAT-647","nome":"PARAFUSO SEXTAVADO SOBERBA ZINCADO 5/16X 90","categoria":"Fixação & Pregos","especie":"Aço","tipo_calculo":"UN","unidade_medida":"UN","preco_unitario":2.5,"taxa_plaina_padrao":0,"estoque_atual":120,"estoque_minimo":30,"ativo":true},
  {"id":"prod_648","codigo":"MAT-648","nome":"PASSA FIO C/ ALMA DE AÇO 10 MTS FOXLUX","categoria":"Elétrica & Iluminação","especie":"Aço","tipo_calculo":"UN","unidade_medida":"UN","preco_unitario":34.2,"taxa_plaina_padrao":0,"estoque_atual":55,"estoque_minimo":15,"ativo":true},
  {"id":"prod_649","codigo":"MAT-649","nome":"PASSA FIO C/ ALMA DE AÇO 20 MTS FOXLUX","categoria":"Elétrica & Iluminação","especie":"Aço","tipo_calculo":"UN","unidade_medida":"UN","preco_unitario":42.6,"taxa_plaina_padrao":0,"estoque_atual":55,"estoque_minimo":15,"ativo":true},
  {"id":"prod_650","codigo":"1-489","nome":"PASSA FIO C/ ALMA DE AÇO 30 MTS FOXLUX","categoria":"Elétrica & Iluminação","especie":"Aço","tipo_calculo":"UN","unidade_medida":"UN","preco_unitario":35,"taxa_plaina_padrao":0,"estoque_atual":55,"estoque_minimo":15,"ativo":true},
  {"id":"prod_651","codigo":"1-490","nome":"PASSARINHEIRA TELHADO MR COBER","categoria":"Telhas & Coberturas","especie":"Diversos","tipo_calculo":"UN","unidade_medida":"UN","preco_unitario":4.8,"taxa_plaina_padrao":0,"estoque_atual":850,"estoque_minimo":150,"ativo":true},
  {"id":"prod_652","codigo":"1-491","nome":"PASTA DESENGRAXANTE 4,5 KG","categoria":"Tintas & Química","especie":"Químico","tipo_calculo":"UN","unidade_medida":"UN","preco_unitario":45,"taxa_plaina_padrao":0,"estoque_atual":35,"estoque_minimo":10,"ativo":true},
  {"id":"prod_653","codigo":"1-494","nome":"PEDRA AFIADOR DUPLA FACE 8X2X1","categoria":"Ferramentas & Acessórios","especie":"Aço / Ferramental","tipo_calculo":"UN","unidade_medida":"UN","preco_unitario":9.6,"taxa_plaina_padrao":0,"estoque_atual":25,"estoque_minimo":5,"ativo":true},
  {"id":"prod_654","codigo":"1-495","nome":"PEDRA AFIADOR TIPO CANOA 225 MM","categoria":"Ferramentas & Acessórios","especie":"Aço / Ferramental","tipo_calculo":"UN","unidade_medida":"UN","preco_unitario":5.7,"taxa_plaina_padrao":0,"estoque_atual":25,"estoque_minimo":5,"ativo":true},
  {"id":"prod_655","codigo":"MAT-655","nome":"PEDRA SANITARIA","categoria":"EPIs, Cordas & Diversos","especie":"Diversos","tipo_calculo":"UN","unidade_medida":"UN","preco_unitario":2.7,"taxa_plaina_padrao":0,"estoque_atual":40,"estoque_minimo":10,"ativo":true},
  {"id":"prod_656","codigo":"1-496","nome":"PENEIRA AREIA E ARROZ 50 SÃO JORGE","categoria":"Ferramentas & Acessórios","especie":"Aço / Ferramental","tipo_calculo":"UN","unidade_medida":"UN","preco_unitario":25.4,"taxa_plaina_padrao":0,"estoque_atual":25,"estoque_minimo":5,"ativo":true},
  {"id":"prod_657","codigo":"1-497","nome":"PETRA 1 INTERRUPTOR SIMPLES + TOMADA 10A 250V","categoria":"Elétrica & Iluminação","especie":"Cobre / Termoplástico","tipo_calculo":"UN","unidade_medida":"UN","preco_unitario":16.6,"taxa_plaina_padrao":0,"estoque_atual":55,"estoque_minimo":15,"ativo":true},
  {"id":"prod_658","codigo":"1-498","nome":"PETRA 1 INTERRUPTOR SIMPLES VERTICAL 10A 250V","categoria":"Elétrica & Iluminação","especie":"Cobre / Termoplástico","tipo_calculo":"UN","unidade_medida":"UN","preco_unitario":9.9,"taxa_plaina_padrao":0,"estoque_atual":55,"estoque_minimo":15,"ativo":true},
  {"id":"prod_659","codigo":"1-499","nome":"PETRA 2 INTERRUPTOR SIMPLES 10A 250V","categoria":"Elétrica & Iluminação","especie":"Cobre / Termoplástico","tipo_calculo":"UN","unidade_medida":"UN","preco_unitario":15.6,"taxa_plaina_padrao":0,"estoque_atual":55,"estoque_minimo":15,"ativo":true},
  {"id":"prod_660","codigo":"1-500","nome":"PETRA MODULO INTERRUPTOR SIMPLHES 10A 250V","categoria":"Elétrica & Iluminação","especie":"Cobre / Termoplástico","tipo_calculo":"UN","unidade_medida":"UN","preco_unitario":5.7,"taxa_plaina_padrao":0,"estoque_atual":55,"estoque_minimo":15,"ativo":true},
  {"id":"prod_661","codigo":"1-501","nome":"PETRA MODULO TOMADA 10A 250V BRANCA","categoria":"Elétrica & Iluminação","especie":"Cobre / Termoplástico","tipo_calculo":"UN","unidade_medida":"UN","preco_unitario":7.7,"taxa_plaina_padrao":0,"estoque_atual":55,"estoque_minimo":15,"ativo":true},
  {"id":"prod_662","codigo":"1-502","nome":"PETRA MODULO TOMADA 20A 250V VERMELHA","categoria":"Elétrica & Iluminação","especie":"Cobre / Termoplástico","tipo_calculo":"UN","unidade_medida":"UN","preco_unitario":9.6,"taxa_plaina_padrao":0,"estoque_atual":55,"estoque_minimo":15,"ativo":true},
  {"id":"prod_663","codigo":"1-503","nome":"PETRA PLACA 4X2 CEGA","categoria":"Elétrica & Iluminação","especie":"Cobre / Termoplástico","tipo_calculo":"UN","unidade_medida":"UN","preco_unitario":4.8,"taxa_plaina_padrao":0,"estoque_atual":55,"estoque_minimo":15,"ativo":true},
  {"id":"prod_664","codigo":"1-504","nome":"PETRA PLACA 4X2 MODULO DIST.","categoria":"Elétrica & Iluminação","especie":"Cobre / Termoplástico","tipo_calculo":"UN","unidade_medida":"UN","preco_unitario":4.8,"taxa_plaina_padrao":0,"estoque_atual":55,"estoque_minimo":15,"ativo":true},
  {"id":"prod_665","codigo":"1-505","nome":"PETRA PLACA 4X2 MODULO HORIZONTAL","categoria":"Elétrica & Iluminação","especie":"Cobre / Termoplástico","tipo_calculo":"UN","unidade_medida":"UN","preco_unitario":4.8,"taxa_plaina_padrao":0,"estoque_atual":55,"estoque_minimo":15,"ativo":true},
  {"id":"prod_666","codigo":"1-506","nome":"PETRA PLACA 4X2 MODULO VERTICAL","categoria":"Elétrica & Iluminação","especie":"Cobre / Termoplástico","tipo_calculo":"UN","unidade_medida":"UN","preco_unitario":4.8,"taxa_plaina_padrao":0,"estoque_atual":55,"estoque_minimo":15,"ativo":true},
  {"id":"prod_667","codigo":"1-507","nome":"PETRA TOMADA DUPLA 20A 250V","categoria":"Elétrica & Iluminação","especie":"Cobre / Termoplástico","tipo_calculo":"UN","unidade_medida":"UN","preco_unitario":8.7,"taxa_plaina_padrao":0,"estoque_atual":55,"estoque_minimo":15,"ativo":true},
  {"id":"prod_668","codigo":"1-508","nome":"PETRA TOMADA SIMPLES HORIZONTAL 20A 250V","categoria":"Elétrica & Iluminação","especie":"Cobre / Termoplástico","tipo_calculo":"UN","unidade_medida":"UN","preco_unitario":12,"taxa_plaina_padrao":0,"estoque_atual":55,"estoque_minimo":15,"ativo":true},
  {"id":"prod_669","codigo":"1-509","nome":"PICARETA MINASUL (CHIBANCA) C/ CABO","categoria":"Ferramentas & Acessórios","especie":"Aço / Ferramental","tipo_calculo":"UN","unidade_medida":"UN","preco_unitario":88,"taxa_plaina_padrao":0,"estoque_atual":25,"estoque_minimo":5,"ativo":true},
  {"id":"prod_670","codigo":"1-510","nome":"PICARETA PA E PONTA  C/ CABO MINASUL","categoria":"Ferramentas & Acessórios","especie":"Aço / Ferramental","tipo_calculo":"UN","unidade_medida":"UN","preco_unitario":88,"taxa_plaina_padrao":0,"estoque_atual":25,"estoque_minimo":5,"ativo":true},
  {"id":"prod_671","codigo":"1-511","nome":"PILHA PANASONIC SUPER HYPER AA C/4 PÇ","categoria":"Elétrica & Iluminação","especie":"Cobre / Termoplástico","tipo_calculo":"UN","unidade_medida":"UN","preco_unitario":6,"taxa_plaina_padrao":0,"estoque_atual":55,"estoque_minimo":15,"ativo":true},
  {"id":"prod_672","codigo":"1-512","nome":"PILHA PANASONIC SUPER HYPER AAA C/4 PÇ","categoria":"Elétrica & Iluminação","especie":"Cobre / Termoplástico","tipo_calculo":"UN","unidade_medida":"UN","preco_unitario":7.5,"taxa_plaina_padrao":0,"estoque_atual":55,"estoque_minimo":15,"ativo":true},
  {"id":"prod_673","codigo":"1-513","nome":"PINCEL TRINCHA 3/4","categoria":"Ferramentas & Acessórios","especie":"Aço / Ferramental","tipo_calculo":"UN","unidade_medida":"UN","preco_unitario":3.3,"taxa_plaina_padrao":0,"estoque_atual":25,"estoque_minimo":5,"ativo":true},
  {"id":"prod_674","codigo":"1-514","nome":"PINCEL TRINCHA ATLAS 1","categoria":"Ferramentas & Acessórios","especie":"Aço / Ferramental","tipo_calculo":"UN","unidade_medida":"UN","preco_unitario":4.2,"taxa_plaina_padrao":0,"estoque_atual":25,"estoque_minimo":5,"ativo":true},
  {"id":"prod_675","codigo":"MAT-675","nome":"PINCEL TRINCHA ATLAS 2","categoria":"Ferramentas & Acessórios","especie":"Aço / Ferramental","tipo_calculo":"UN","unidade_medida":"UN","preco_unitario":6.1,"taxa_plaina_padrao":0,"estoque_atual":25,"estoque_minimo":5,"ativo":true},
  {"id":"prod_676","codigo":"1-515","nome":"PINCEL TRINCHA ATLAS 3","categoria":"Ferramentas & Acessórios","especie":"Aço / Ferramental","tipo_calculo":"UN","unidade_medida":"UN","preco_unitario":9.6,"taxa_plaina_padrao":0,"estoque_atual":25,"estoque_minimo":5,"ativo":true},
  {"id":"prod_677","codigo":"MAT-677","nome":"PINCEL TRINCHA ATLAS 3/4","categoria":"Ferramentas & Acessórios","especie":"Aço / Ferramental","tipo_calculo":"UN","unidade_medida":"UN","preco_unitario":2.3,"taxa_plaina_padrao":0,"estoque_atual":25,"estoque_minimo":5,"ativo":true},
  {"id":"prod_678","codigo":"MAT-678","nome":"PINCEL TRINCHA TIGRE 1","categoria":"Ferramentas & Acessórios","especie":"Aço / Ferramental","tipo_calculo":"UN","unidade_medida":"UN","preco_unitario":5.2,"taxa_plaina_padrao":0,"estoque_atual":25,"estoque_minimo":5,"ativo":true},
  {"id":"prod_679","codigo":"MAT-679","nome":"PINCEL TRINCHA TIGRE 2","categoria":"Ferramentas & Acessórios","especie":"Aço / Ferramental","tipo_calculo":"UN","unidade_medida":"UN","preco_unitario":7.2,"taxa_plaina_padrao":0,"estoque_atual":25,"estoque_minimo":5,"ativo":true},
  {"id":"prod_680","codigo":"1-519","nome":"PINO ADAPTADOR TE","categoria":"Elétrica & Iluminação","especie":"Cobre / Termoplástico","tipo_calculo":"UN","unidade_medida":"UN","preco_unitario":5.4,"taxa_plaina_padrao":0,"estoque_atual":55,"estoque_minimo":15,"ativo":true},
  {"id":"prod_681","codigo":"MAT-681","nome":"PINO FEMEA 10 A","categoria":"Elétrica & Iluminação","especie":"Cobre / Termoplástico","tipo_calculo":"UN","unidade_medida":"UN","preco_unitario":5.2,"taxa_plaina_padrao":0,"estoque_atual":55,"estoque_minimo":15,"ativo":true},
  {"id":"prod_682","codigo":"1-520","nome":"PINO FEMEA 2P 20A E 10A","categoria":"Elétrica & Iluminação","especie":"Cobre / Termoplástico","tipo_calculo":"UN","unidade_medida":"UN","preco_unitario":6.45,"taxa_plaina_padrao":0,"estoque_atual":55,"estoque_minimo":15,"ativo":true},
  {"id":"prod_683","codigo":"MAT-683","nome":"PINO MACHO 2P 10 A","categoria":"Elétrica & Iluminação","especie":"Cobre / Termoplástico","tipo_calculo":"UN","unidade_medida":"UN","preco_unitario":3.6,"taxa_plaina_padrao":0,"estoque_atual":55,"estoque_minimo":15,"ativo":true},
  {"id":"prod_684","codigo":"MAT-684","nome":"PINO MACHO 2P 20A BR","categoria":"Elétrica & Iluminação","especie":"Cobre / Termoplástico","tipo_calculo":"UN","unidade_medida":"UN","preco_unitario":5.8,"taxa_plaina_padrao":0,"estoque_atual":55,"estoque_minimo":15,"ativo":true},
  {"id":"prod_685","codigo":"1-521","nome":"PINO MACHO 2P 20A E 10A","categoria":"Elétrica & Iluminação","especie":"Cobre / Termoplástico","tipo_calculo":"UN","unidade_medida":"UN","preco_unitario":4.65,"taxa_plaina_padrao":0,"estoque_atual":55,"estoque_minimo":15,"ativo":true},
  {"id":"prod_686","codigo":"MAT-686","nome":"PISTOLA SILICONE SEMI ABERTO TUBO ATE 310ML","categoria":"Tintas & Química","especie":"Químico","tipo_calculo":"UN","unidade_medida":"UN","preco_unitario":16.8,"taxa_plaina_padrao":0,"estoque_atual":35,"estoque_minimo":10,"ativo":true},
  {"id":"prod_687","codigo":"1-523","nome":"PISTOLA SILICONE TUBO ATE 310 ML","categoria":"Tintas & Química","especie":"Químico","tipo_calculo":"UN","unidade_medida":"UN","preco_unitario":15.3,"taxa_plaina_padrao":0,"estoque_atual":35,"estoque_minimo":10,"ativo":true},
  {"id":"prod_688","codigo":"1-524","nome":"PLAFON E27 SOQUETE ILUMINAÇÃO 100 W BRANCO","categoria":"Elétrica & Iluminação","especie":"Cobre / Termoplástico","tipo_calculo":"UN","unidade_medida":"UN","preco_unitario":7.6,"taxa_plaina_padrao":0,"estoque_atual":55,"estoque_minimo":15,"ativo":true},
  {"id":"prod_689","codigo":"1-525","nome":"PLAFON E27 SOQUETE ILUMINAÇÃO 100 W PRETO","categoria":"Elétrica & Iluminação","especie":"Cobre / Termoplástico","tipo_calculo":"UN","unidade_medida":"UN","preco_unitario":7.6,"taxa_plaina_padrao":0,"estoque_atual":55,"estoque_minimo":15,"ativo":true},
  {"id":"prod_690","codigo":"1-526","nome":"PLUG ROSCA (A) 1/2 PLASTUBOS","categoria":"Hidráulica & Conexões","especie":"PVC / Metal","tipo_calculo":"UN","unidade_medida":"UN","preco_unitario":0.6,"taxa_plaina_padrao":0,"estoque_atual":70,"estoque_minimo":20,"ativo":true},
  {"id":"prod_691","codigo":"1-527","nome":"PLUG ROSCA (B) 3/4 PLASTUBOS","categoria":"Hidráulica & Conexões","especie":"PVC / Metal","tipo_calculo":"UN","unidade_medida":"UN","preco_unitario":0.9,"taxa_plaina_padrao":0,"estoque_atual":70,"estoque_minimo":20,"ativo":true},
  {"id":"prod_692","codigo":"1-528","nome":"PNEU CARRINHO 3.25/8","categoria":"Ferramentas & Acessórios","especie":"Aço / Ferramental","tipo_calculo":"UN","unidade_medida":"UN","preco_unitario":40.2,"taxa_plaina_padrao":0,"estoque_atual":25,"estoque_minimo":5,"ativo":true},
  {"id":"prod_693","codigo":"1-529","nome":"PORCA TORNEADA 1/2","categoria":"Fixação & Pregos","especie":"Aço","tipo_calculo":"UN","unidade_medida":"UN","preco_unitario":1.5,"taxa_plaina_padrao":0,"estoque_atual":120,"estoque_minimo":30,"ativo":true},
  {"id":"prod_694","codigo":"1-530","nome":"PORCA TORNEADA 1/4","categoria":"Fixação & Pregos","especie":"Aço","tipo_calculo":"UN","unidade_medida":"UN","preco_unitario":0.4,"taxa_plaina_padrao":0,"estoque_atual":120,"estoque_minimo":30,"ativo":true},
  {"id":"prod_695","codigo":"1-531","nome":"PORCA TORNEADA 3/16","categoria":"Fixação & Pregos","especie":"Aço","tipo_calculo":"UN","unidade_medida":"UN","preco_unitario":0.3,"taxa_plaina_padrao":0,"estoque_atual":120,"estoque_minimo":30,"ativo":true},
  {"id":"prod_696","codigo":"MAT-696","nome":"PORCA TORNEADA 3/8","categoria":"Fixação & Pregos","especie":"Aço","tipo_calculo":"UN","unidade_medida":"UN","preco_unitario":0.3,"taxa_plaina_padrao":0,"estoque_atual":120,"estoque_minimo":30,"ativo":true},
  {"id":"prod_697","codigo":"1-532","nome":"PORCA TORNEADA 3/8 -","categoria":"Fixação & Pregos","especie":"Aço","tipo_calculo":"UN","unidade_medida":"UN","preco_unitario":0.3,"taxa_plaina_padrao":0,"estoque_atual":120,"estoque_minimo":30,"ativo":true},
  {"id":"prod_698","codigo":"MAT-698","nome":"PORCA TORNEADA 5/16","categoria":"Fixação & Pregos","especie":"Aço","tipo_calculo":"UN","unidade_medida":"UN","preco_unitario":0.4,"taxa_plaina_padrao":0,"estoque_atual":120,"estoque_minimo":30,"ativo":true},
  {"id":"prod_699","codigo":"1-533","nome":"PORCA TORNEADA 5/16 - 220 PÇ","categoria":"Fixação & Pregos","especie":"Aço","tipo_calculo":"UN","unidade_medida":"UN","preco_unitario":0.2,"taxa_plaina_padrao":0,"estoque_atual":120,"estoque_minimo":30,"ativo":true},
  {"id":"prod_700","codigo":"MAT-700","nome":"PORTA CADEADO 2 1 PÇ","categoria":"Ferragens & Cercas","especie":"Aço Galvanizado","tipo_calculo":"UN","unidade_medida":"UN","preco_unitario":10.2,"taxa_plaina_padrao":0,"estoque_atual":45,"estoque_minimo":10,"ativo":true},
  {"id":"prod_701","codigo":"MAT-701","nome":"PORTA CADEADO 2. 1/2 1 PÇ","categoria":"Ferragens & Cercas","especie":"Aço Galvanizado","tipo_calculo":"UN","unidade_medida":"UN","preco_unitario":11.1,"taxa_plaina_padrao":0,"estoque_atual":45,"estoque_minimo":10,"ativo":true},
  {"id":"prod_702","codigo":"MAT-702","nome":"PORTA CADEADO 3 1/2\" 1 PÇ","categoria":"Ferragens & Cercas","especie":"Aço Galvanizado","tipo_calculo":"UN","unidade_medida":"UN","preco_unitario":18.9,"taxa_plaina_padrao":0,"estoque_atual":45,"estoque_minimo":10,"ativo":true},
  {"id":"prod_703","codigo":"1-534","nome":"PORTA ELETRODO 500 AMPERES","categoria":"Ferramentas & Acessórios","especie":"Aço / Ferramental","tipo_calculo":"UN","unidade_medida":"UN","preco_unitario":31.8,"taxa_plaina_padrao":0,"estoque_atual":25,"estoque_minimo":5,"ativo":true},
  {"id":"prod_704","codigo":"MAT-704","nome":"PORTA ELETRODO MTX 500 AMPERES FIO 6,0 - 10,0 MM","categoria":"Ferramentas & Acessórios","especie":"Aço / Ferramental","tipo_calculo":"UN","unidade_medida":"UN","preco_unitario":25.2,"taxa_plaina_padrao":0,"estoque_atual":25,"estoque_minimo":5,"ativo":true},
  {"id":"prod_705","codigo":"1-535","nome":"PORTA LISA CANELA 60 - 62 - 70 - 72 - 80 - 82","categoria":"Madeiras & Esquadrias","especie":"Canela","tipo_calculo":"UN","unidade_medida":"UN","preco_unitario":190.4,"taxa_plaina_padrao":0,"estoque_atual":15,"estoque_minimo":5,"ativo":true},
  {"id":"prod_706","codigo":"MAT-706","nome":"PORTA LISA CANELINHA 82 CM 2.10X0.35","categoria":"Madeiras & Esquadrias","especie":"Canela","tipo_calculo":"UN","unidade_medida":"UN","preco_unitario":150,"taxa_plaina_padrao":0,"estoque_atual":15,"estoque_minimo":5,"ativo":true},
  {"id":"prod_707","codigo":"1-539","nome":"PORTA LISA PINUS 60 - 62, 70 - 72, 80 - 82","categoria":"Madeiras & Esquadrias","especie":"Pinus","tipo_calculo":"UN","unidade_medida":"UN","preco_unitario":142.8,"taxa_plaina_padrao":0,"estoque_atual":15,"estoque_minimo":5,"ativo":true},
  {"id":"prod_708","codigo":"MAT-708","nome":"PORTA LISA SUCUPIRA 60 CM, 70 CM, 80 CM","categoria":"Madeiras & Esquadrias","especie":"Sucupira","tipo_calculo":"UN","unidade_medida":"UN","preco_unitario":247,"taxa_plaina_padrao":0,"estoque_atual":15,"estoque_minimo":5,"ativo":true},
  {"id":"prod_709","codigo":"1-536","nome":"PORTA LISA SUCUPIRA 70 CM, 80 CM","categoria":"Madeiras & Esquadrias","especie":"Sucupira","tipo_calculo":"UN","unidade_medida":"UN","preco_unitario":249,"taxa_plaina_padrao":0,"estoque_atual":15,"estoque_minimo":5,"ativo":true},
  {"id":"prod_710","codigo":"MAT-710","nome":"PORTA LISA TAUARI 60 CM, 70 CM, 80 CM","categoria":"Madeiras & Esquadrias","especie":"Tauari","tipo_calculo":"UN","unidade_medida":"UN","preco_unitario":207,"taxa_plaina_padrao":0,"estoque_atual":15,"estoque_minimo":5,"ativo":true},
  {"id":"prod_711","codigo":"MAT-711","nome":"PORTA LISA TAUARI 90 CM, 100 MT","categoria":"Madeiras & Esquadrias","especie":"Tauari","tipo_calculo":"UN","unidade_medida":"UN","preco_unitario":231,"taxa_plaina_padrao":0,"estoque_atual":15,"estoque_minimo":5,"ativo":true},
  {"id":"prod_712","codigo":"1-540","nome":"PORTA LISA VIROLA SIMI OCA 90 CM","categoria":"Madeiras & Esquadrias","especie":"Virola","tipo_calculo":"UN","unidade_medida":"UN","preco_unitario":144,"taxa_plaina_padrao":0,"estoque_atual":15,"estoque_minimo":5,"ativo":true},
  {"id":"prod_713","codigo":"MAT-713","nome":"PORTA LISA VIROLA SIMI OCA P/ PINTURA 60 CM, 70 CM, 80 CM","categoria":"Madeiras & Esquadrias","especie":"Virola","tipo_calculo":"UN","unidade_medida":"UN","preco_unitario":143,"taxa_plaina_padrao":0,"estoque_atual":15,"estoque_minimo":5,"ativo":true},
  {"id":"prod_714","codigo":"MAT-714","nome":"PORTA LISA VIROLA SIMI OCA P/ PINTURA 90 CM","categoria":"Madeiras & Esquadrias","especie":"Virola","tipo_calculo":"UN","unidade_medida":"UN","preco_unitario":159,"taxa_plaina_padrao":0,"estoque_atual":15,"estoque_minimo":5,"ativo":true},
  {"id":"prod_715","codigo":"1-541","nome":"PREGO 10X10 C/C - 50G","categoria":"Fixação & Pregos","especie":"Aço","tipo_calculo":"UN","unidade_medida":"UN","preco_unitario":5,"taxa_plaina_padrao":0,"estoque_atual":120,"estoque_minimo":30,"ativo":true},
  {"id":"prod_716","codigo":"1-545","nome":"PREGO 10X10 C/C - KG","categoria":"Fixação & Pregos","especie":"Aço","tipo_calculo":"UN","unidade_medida":"KG","preco_unitario":36.9,"taxa_plaina_padrao":0,"estoque_atual":120,"estoque_minimo":30,"ativo":true},
  {"id":"prod_717","codigo":"1-542","nome":"PREGO 12X12 C/C - 50 G","categoria":"Fixação & Pregos","especie":"Aço","tipo_calculo":"UN","unidade_medida":"UN","preco_unitario":3.6,"taxa_plaina_padrao":0,"estoque_atual":120,"estoque_minimo":30,"ativo":true},
  {"id":"prod_718","codigo":"1-543","nome":"PREGO 15X15 C/C - 50 G","categoria":"Fixação & Pregos","especie":"Aço","tipo_calculo":"UN","unidade_medida":"UN","preco_unitario":3.2,"taxa_plaina_padrao":0,"estoque_atual":120,"estoque_minimo":30,"ativo":true},
  {"id":"prod_719","codigo":"1-546","nome":"PREGO 15X15 C/C-KG","categoria":"Fixação & Pregos","especie":"Aço","tipo_calculo":"UN","unidade_medida":"UN","preco_unitario":21.75,"taxa_plaina_padrao":0,"estoque_atual":120,"estoque_minimo":30,"ativo":true},
  {"id":"prod_720","codigo":"1-544","nome":"PREGO 17X21 C/C - 50 G","categoria":"Fixação & Pregos","especie":"Aço","tipo_calculo":"UN","unidade_medida":"UN","preco_unitario":3.2,"taxa_plaina_padrao":0,"estoque_atual":120,"estoque_minimo":30,"ativo":true},
  {"id":"prod_721","codigo":"1-547","nome":"PREGO 17X21 C/C - KG","categoria":"Fixação & Pregos","especie":"Aço","tipo_calculo":"UN","unidade_medida":"KG","preco_unitario":17.1,"taxa_plaina_padrao":0,"estoque_atual":3,"estoque_minimo":15,"ativo":true},
  {"id":"prod_722","codigo":"1-548","nome":"PREGO 17X21 C/C - KG GALVONIZADO","categoria":"Fixação & Pregos","especie":"Aço","tipo_calculo":"UN","unidade_medida":"KG","preco_unitario":39,"taxa_plaina_padrao":0,"estoque_atual":120,"estoque_minimo":30,"ativo":true},
  {"id":"prod_723","codigo":"1-549","nome":"PREGO 17X27 C/C - HG","categoria":"Fixação & Pregos","especie":"Aço","tipo_calculo":"UN","unidade_medida":"UN","preco_unitario":17.1,"taxa_plaina_padrao":0,"estoque_atual":120,"estoque_minimo":30,"ativo":true},
  {"id":"prod_724","codigo":"1-550","nome":"PREGO 17X27 C/C - KG GALVONIZADO","categoria":"Fixação & Pregos","especie":"Aço","tipo_calculo":"UN","unidade_medida":"KG","preco_unitario":39,"taxa_plaina_padrao":0,"estoque_atual":120,"estoque_minimo":30,"ativo":true},
  {"id":"prod_725","codigo":"1-551","nome":"PREGO 18X30 C/C - KG","categoria":"Fixação & Pregos","especie":"Aço","tipo_calculo":"UN","unidade_medida":"KG","preco_unitario":17.1,"taxa_plaina_padrao":0,"estoque_atual":120,"estoque_minimo":30,"ativo":true},
  {"id":"prod_726","codigo":"1-552","nome":"PREGO 18X30 C/C - KG GALVONIZADO","categoria":"Fixação & Pregos","especie":"Aço","tipo_calculo":"UN","unidade_medida":"KG","preco_unitario":39,"taxa_plaina_padrao":0,"estoque_atual":120,"estoque_minimo":30,"ativo":true},
  {"id":"prod_727","codigo":"1-553","nome":"PREGO 18X36 C/C - KG","categoria":"Fixação & Pregos","especie":"Aço","tipo_calculo":"UN","unidade_medida":"KG","preco_unitario":17.1,"taxa_plaina_padrao":0,"estoque_atual":120,"estoque_minimo":30,"ativo":true},
  {"id":"prod_728","codigo":"1-554","nome":"PREGO 19X30 C/C - KG","categoria":"Fixação & Pregos","especie":"Aço","tipo_calculo":"UN","unidade_medida":"KG","preco_unitario":17.1,"taxa_plaina_padrao":0,"estoque_atual":120,"estoque_minimo":30,"ativo":true},
  {"id":"prod_729","codigo":"1-555","nome":"PREGO 19X36 C/C - KG","categoria":"Fixação & Pregos","especie":"Aço","tipo_calculo":"UN","unidade_medida":"KG","preco_unitario":17.1,"taxa_plaina_padrao":0,"estoque_atual":120,"estoque_minimo":30,"ativo":true},
  {"id":"prod_730","codigo":"1-556","nome":"PREGO 22X42 C/C - KG","categoria":"Fixação & Pregos","especie":"Aço","tipo_calculo":"UN","unidade_medida":"KG","preco_unitario":17.1,"taxa_plaina_padrao":0,"estoque_atual":120,"estoque_minimo":30,"ativo":true},
  {"id":"prod_731","codigo":"1-557","nome":"PREGO 22X48 C/C - KG","categoria":"Fixação & Pregos","especie":"Aço","tipo_calculo":"UN","unidade_medida":"KG","preco_unitario":17.1,"taxa_plaina_padrao":0,"estoque_atual":120,"estoque_minimo":30,"ativo":true},
  {"id":"prod_732","codigo":"1-558","nome":"PREGO 25X72 C/C - KG","categoria":"Fixação & Pregos","especie":"Aço","tipo_calculo":"UN","unidade_medida":"KG","preco_unitario":23.4,"taxa_plaina_padrao":0,"estoque_atual":120,"estoque_minimo":30,"ativo":true},
  {"id":"prod_733","codigo":"1-559","nome":"PREGO 26X84 C/C - KG","categoria":"Fixação & Pregos","especie":"Aço","tipo_calculo":"UN","unidade_medida":"KG","preco_unitario":28.2,"taxa_plaina_padrao":0,"estoque_atual":120,"estoque_minimo":30,"ativo":true},
  {"id":"prod_734","codigo":"1-560","nome":"PREGO 27X30 C/C - KG","categoria":"Fixação & Pregos","especie":"Aço","tipo_calculo":"UN","unidade_medida":"KG","preco_unitario":32.7,"taxa_plaina_padrao":0,"estoque_atual":120,"estoque_minimo":30,"ativo":true},
  {"id":"prod_735","codigo":"1-561","nome":"PREGO ARDOX 16x18 C/C - KG","categoria":"Fixação & Pregos","especie":"Aço","tipo_calculo":"UN","unidade_medida":"KG","preco_unitario":37.5,"taxa_plaina_padrao":0,"estoque_atual":120,"estoque_minimo":30,"ativo":true},
  {"id":"prod_736","codigo":"1-562","nome":"PREGO GRAMPO DE CERCA 1X9 - KG","categoria":"Fixação & Pregos","especie":"Aço","tipo_calculo":"UN","unidade_medida":"KG","preco_unitario":22.5,"taxa_plaina_padrao":0,"estoque_atual":120,"estoque_minimo":30,"ativo":true},
  {"id":"prod_737","codigo":"1-563","nome":"PREGO TELHEIRO 18X27 - 1/2 KG","categoria":"Telhas & Coberturas","especie":"Diversos","tipo_calculo":"UN","unidade_medida":"UN","preco_unitario":28.2,"taxa_plaina_padrao":0,"estoque_atual":850,"estoque_minimo":150,"ativo":true},
  {"id":"prod_738","codigo":"1-564","nome":"PROTETOR AUDITIVO PRETO (TIPO CONCHA)","categoria":"EPIs, Cordas & Diversos","especie":"Diversos","tipo_calculo":"UN","unidade_medida":"UN","preco_unitario":24,"taxa_plaina_padrao":0,"estoque_atual":40,"estoque_minimo":10,"ativo":true},
  {"id":"prod_739","codigo":"1-565","nome":"PROTETOR AUDITIVO SILICONE C/ CORDÃO","categoria":"Tintas & Química","especie":"Químico","tipo_calculo":"UN","unidade_medida":"UN","preco_unitario":3,"taxa_plaina_padrao":0,"estoque_atual":35,"estoque_minimo":10,"ativo":true},
  {"id":"prod_740","codigo":"1-566","nome":"PRUMO AÇO MACISO 500 GR THOMPSON","categoria":"Ferramentas & Acessórios","especie":"Aço","tipo_calculo":"UN","unidade_medida":"UN","preco_unitario":28.6,"taxa_plaina_padrao":0,"estoque_atual":25,"estoque_minimo":5,"ativo":true},
  {"id":"prod_741","codigo":"1-567","nome":"PRUMO PLASTICO AMARELO E PRETO THOMPSON 420 GR","categoria":"Ferramentas & Acessórios","especie":"Aço / Ferramental","tipo_calculo":"UN","unidade_medida":"UN","preco_unitario":16.8,"taxa_plaina_padrao":0,"estoque_atual":25,"estoque_minimo":5,"ativo":true},
  {"id":"prod_742","codigo":"1-568","nome":"PU CALHAS E RUFOS 80 G","categoria":"Tintas & Química","especie":"Químico","tipo_calculo":"UN","unidade_medida":"UN","preco_unitario":10.8,"taxa_plaina_padrao":0,"estoque_atual":35,"estoque_minimo":10,"ativo":true},
  {"id":"prod_743","codigo":"MAT-743","nome":"PU CALHAS E RUFOS BRANCO /CINZA","categoria":"Tintas & Química","especie":"Químico","tipo_calculo":"UN","unidade_medida":"UN","preco_unitario":9.9,"taxa_plaina_padrao":0,"estoque_atual":35,"estoque_minimo":10,"ativo":true},
  {"id":"prod_744","codigo":"MAT-744","nome":"PÁ DE BICO TRAMONTINA C/CABO","categoria":"Ferramentas & Acessórios","especie":"Aço / Ferramental","tipo_calculo":"UN","unidade_medida":"UN","preco_unitario":48,"taxa_plaina_padrao":0,"estoque_atual":25,"estoque_minimo":5,"ativo":true},
  {"id":"prod_745","codigo":"MAT-745","nome":"PÉ DE CABRA 3/4 X 60","categoria":"Ferramentas & Acessórios","especie":"Aço / Ferramental","tipo_calculo":"UN","unidade_medida":"UN","preco_unitario":26.8,"taxa_plaina_padrao":0,"estoque_atual":25,"estoque_minimo":5,"ativo":true},
  {"id":"prod_746","codigo":"1-492","nome":"PÉ DE CABRA 3/4 X 60 CM","categoria":"Ferramentas & Acessórios","especie":"Aço / Ferramental","tipo_calculo":"UN","unidade_medida":"UN","preco_unitario":32.7,"taxa_plaina_padrao":0,"estoque_atual":25,"estoque_minimo":5,"ativo":true},
  {"id":"prod_747","codigo":"MAT-747","nome":"PÉ DE CABRA 5/8 X 60","categoria":"Ferramentas & Acessórios","especie":"Aço / Ferramental","tipo_calculo":"UN","unidade_medida":"UN","preco_unitario":21,"taxa_plaina_padrao":0,"estoque_atual":25,"estoque_minimo":5,"ativo":true},
  {"id":"prod_748","codigo":"1-493","nome":"PÉ DE CABRA 5/8 X 60 CM","categoria":"Ferramentas & Acessórios","especie":"Aço / Ferramental","tipo_calculo":"UN","unidade_medida":"UN","preco_unitario":28.2,"taxa_plaina_padrao":0,"estoque_atual":25,"estoque_minimo":5,"ativo":true},
  {"id":"prod_749","codigo":"1-569","nome":"RALO SIF QUADR BRANCO 100X45X40 AMANCO","categoria":"Hidráulica & Conexões","especie":"PVC / Metal","tipo_calculo":"UN","unidade_medida":"UN","preco_unitario":15,"taxa_plaina_padrao":0,"estoque_atual":70,"estoque_minimo":20,"ativo":true},
  {"id":"prod_750","codigo":"1-570","nome":"RALO SIF REDONDO BR N 02 PLASTUBOS 100X38X40","categoria":"Hidráulica & Conexões","especie":"PVC / Metal","tipo_calculo":"UN","unidade_medida":"UN","preco_unitario":9.8,"taxa_plaina_padrao":0,"estoque_atual":70,"estoque_minimo":20,"ativo":true},
  {"id":"prod_751","codigo":"1-571","nome":"RASTELO 12 DENTES C/CB RETO FAMAST","categoria":"Ferramentas & Acessórios","especie":"Aço / Ferramental","tipo_calculo":"UN","unidade_medida":"UN","preco_unitario":27.2,"taxa_plaina_padrao":0,"estoque_atual":25,"estoque_minimo":5,"ativo":true},
  {"id":"prod_752","codigo":"1-572","nome":"RASTELO CURVO PESADO 4D 1/2","categoria":"Ferramentas & Acessórios","especie":"Aço / Ferramental","tipo_calculo":"UN","unidade_medida":"UN","preco_unitario":60.8,"taxa_plaina_padrao":0,"estoque_atual":25,"estoque_minimo":5,"ativo":true},
  {"id":"prod_753","codigo":"1-573","nome":"RASTELO RETO PESADO 4D 1/2","categoria":"Ferramentas & Acessórios","especie":"Aço / Ferramental","tipo_calculo":"UN","unidade_medida":"UN","preco_unitario":60.8,"taxa_plaina_padrao":0,"estoque_atual":25,"estoque_minimo":5,"ativo":true},
  {"id":"prod_754","codigo":"1-574","nome":"RASTELO TRAMONTINA 12 DENTES S/CABO","categoria":"Ferramentas & Acessórios","especie":"Aço / Ferramental","tipo_calculo":"UN","unidade_medida":"UN","preco_unitario":16,"taxa_plaina_padrao":0,"estoque_atual":25,"estoque_minimo":5,"ativo":true},
  {"id":"prod_755","codigo":"1-575","nome":"RECEPTACULO PORCELANA THOMPSON TH51","categoria":"Utilidades Gerais","especie":"Porcelana","tipo_calculo":"UN","unidade_medida":"UN","preco_unitario":3.3,"taxa_plaina_padrao":0,"estoque_atual":40,"estoque_minimo":10,"ativo":true},
  {"id":"prod_756","codigo":"1-576","nome":"REDUÇÃO EXCENTRO ESG 100X50 PLASTUBO","categoria":"Hidráulica & Conexões","especie":"PVC / Metal","tipo_calculo":"UN","unidade_medida":"UN","preco_unitario":8.8,"taxa_plaina_padrao":0,"estoque_atual":70,"estoque_minimo":20,"ativo":true},
  {"id":"prod_757","codigo":"1-577","nome":"REG ESFERA 20 MM SOLD PLASBOHN","categoria":"Hidráulica & Conexões","especie":"PVC / Metal","tipo_calculo":"UN","unidade_medida":"UN","preco_unitario":10.6,"taxa_plaina_padrao":0,"estoque_atual":70,"estoque_minimo":20,"ativo":true},
  {"id":"prod_758","codigo":"1-578","nome":"REG ESFERA 25 MM SOLD PLASBOHN","categoria":"Hidráulica & Conexões","especie":"PVC / Metal","tipo_calculo":"UN","unidade_medida":"UN","preco_unitario":13.6,"taxa_plaina_padrao":0,"estoque_atual":70,"estoque_minimo":20,"ativo":true},
  {"id":"prod_759","codigo":"1-579","nome":"REGADOR PLAST VERDE 10 L METASUL","categoria":"Utilidades Gerais","especie":"Diversos","tipo_calculo":"UN","unidade_medida":"UN","preco_unitario":24.8,"taxa_plaina_padrao":0,"estoque_atual":40,"estoque_minimo":10,"ativo":true},
  {"id":"prod_760","codigo":"1-580","nome":"REGISTRO DE PRESSÃO C-50 KIT METAIS 3/4","categoria":"Hidráulica & Conexões","especie":"PVC / Metal","tipo_calculo":"UN","unidade_medida":"UN","preco_unitario":54,"taxa_plaina_padrao":0,"estoque_atual":70,"estoque_minimo":20,"ativo":true},
  {"id":"prod_761","codigo":"1-583","nome":"REGISTRO ESFERA PVC 50MM KRONA","categoria":"Hidráulica & Conexões","especie":"PVC","tipo_calculo":"UN","unidade_medida":"UN","preco_unitario":33,"taxa_plaina_padrao":0,"estoque_atual":70,"estoque_minimo":20,"ativo":true},
  {"id":"prod_762","codigo":"1-581","nome":"REGISTRO GAVETA C-50 1 1/2 KIT METAIS 3/4","categoria":"Hidráulica & Conexões","especie":"PVC / Metal","tipo_calculo":"UN","unidade_medida":"UN","preco_unitario":82.5,"taxa_plaina_padrao":0,"estoque_atual":70,"estoque_minimo":20,"ativo":true},
  {"id":"prod_763","codigo":"1-582","nome":"REGISTRO PVC ESFERA C/UNIÃO SOLD 25MM PLASTUBOS","categoria":"Hidráulica & Conexões","especie":"PVC","tipo_calculo":"UN","unidade_medida":"UN","preco_unitario":21.6,"taxa_plaina_padrao":0,"estoque_atual":70,"estoque_minimo":20,"ativo":true},
  {"id":"prod_764","codigo":"MAT-764","nome":"REGISTRO PVC ESFERA C/UNIÃO SOLD 50MM PLASTUBOS","categoria":"Hidráulica & Conexões","especie":"PVC","tipo_calculo":"UN","unidade_medida":"UN","preco_unitario":55.4,"taxa_plaina_padrao":0,"estoque_atual":70,"estoque_minimo":20,"ativo":true},
  {"id":"prod_765","codigo":"1-584","nome":"REGULADOR DE GÁS IMAR 1KG/H - 728/01","categoria":"Hidráulica & Conexões","especie":"PVC / Metal","tipo_calculo":"UN","unidade_medida":"KG","preco_unitario":46.5,"taxa_plaina_padrao":0,"estoque_atual":70,"estoque_minimo":20,"ativo":true},
  {"id":"prod_766","codigo":"1-585","nome":"RESINA POLISTEN MOGNO 3,6 ML STAIN","categoria":"Tintas & Química","especie":"Químico","tipo_calculo":"UN","unidade_medida":"UN","preco_unitario":282,"taxa_plaina_padrao":0,"estoque_atual":35,"estoque_minimo":10,"ativo":true},
  {"id":"prod_767","codigo":"1-586","nome":"RESINA POLISTEN MOGNO 900 ML STAIN","categoria":"Tintas & Química","especie":"Químico","tipo_calculo":"UN","unidade_medida":"UN","preco_unitario":84,"taxa_plaina_padrao":0,"estoque_atual":35,"estoque_minimo":10,"ativo":true},
  {"id":"prod_768","codigo":"1-587","nome":"RESINA POLISTEN TRANSPARENTE 3,6 ML STAIN","categoria":"Tintas & Química","especie":"Químico","tipo_calculo":"UN","unidade_medida":"UN","preco_unitario":180,"taxa_plaina_padrao":0,"estoque_atual":35,"estoque_minimo":10,"ativo":true},
  {"id":"prod_769","codigo":"1-588","nome":"RESINA POLISTEN TRANSPARENTE 900 ML STAIN","categoria":"Tintas & Química","especie":"Químico","tipo_calculo":"UN","unidade_medida":"UN","preco_unitario":54,"taxa_plaina_padrao":0,"estoque_atual":35,"estoque_minimo":10,"ativo":true},
  {"id":"prod_770","codigo":"1-590","nome":"RESISTENCIA DUCHA FAME FAMINHO 220V X 6800W 4 TEMP","categoria":"Elétrica & Iluminação","especie":"Cobre / Termoplástico","tipo_calculo":"UN","unidade_medida":"UN","preco_unitario":17.4,"taxa_plaina_padrao":0,"estoque_atual":55,"estoque_minimo":15,"ativo":true},
  {"id":"prod_771","codigo":"1-591","nome":"RESISTENCIA DUCHA LORENZETI ULTRA 220V X 6800W 4 TEMP","categoria":"Elétrica & Iluminação","especie":"Cobre / Termoplástico","tipo_calculo":"UN","unidade_medida":"UN","preco_unitario":36,"taxa_plaina_padrao":0,"estoque_atual":55,"estoque_minimo":15,"ativo":true},
  {"id":"prod_772","codigo":"1-589","nome":"RESISTENCIA DUCHA SINTEX 3 T 220V X 5500W","categoria":"Elétrica & Iluminação","especie":"Cobre / Termoplástico","tipo_calculo":"UN","unidade_medida":"UN","preco_unitario":24.3,"taxa_plaina_padrao":0,"estoque_atual":55,"estoque_minimo":15,"ativo":true},
  {"id":"prod_773","codigo":"1-596","nome":"RODA RODIZIO GIRATORIO 50MM COM ESPIGA","categoria":"Utilidades Gerais","especie":"Diversos","tipo_calculo":"UN","unidade_medida":"UN","preco_unitario":17.4,"taxa_plaina_padrao":0,"estoque_atual":40,"estoque_minimo":10,"ativo":true},
  {"id":"prod_774","codigo":"1-597","nome":"RODO LIMPEZA GERAL C/CABO METAL SEKIT","categoria":"EPIs, Cordas & Diversos","especie":"Diversos","tipo_calculo":"UN","unidade_medida":"UN","preco_unitario":84.8,"taxa_plaina_padrao":0,"estoque_atual":40,"estoque_minimo":10,"ativo":true},
  {"id":"prod_775","codigo":"1-598","nome":"RODO LIMPEZA GERAL C/CABO METAL SEKIT C/ BAIDE PLASTICO","categoria":"EPIs, Cordas & Diversos","especie":"Diversos","tipo_calculo":"UN","unidade_medida":"UN","preco_unitario":197.2,"taxa_plaina_padrao":0,"estoque_atual":40,"estoque_minimo":10,"ativo":true},
  {"id":"prod_776","codigo":"1-599","nome":"ROLDANA BOGNAR 30 POP","categoria":"Utilidades Gerais","especie":"Diversos","tipo_calculo":"UN","unidade_medida":"UN","preco_unitario":0.8,"taxa_plaina_padrao":0,"estoque_atual":40,"estoque_minimo":10,"ativo":true},
  {"id":"prod_777","codigo":"1-600","nome":"ROLO ATLAS ANTI RESPINGO ECONOM 23 CM S/C","categoria":"Ferramentas & Acessórios","especie":"Aço / Ferramental","tipo_calculo":"UN","unidade_medida":"UN","preco_unitario":10.5,"taxa_plaina_padrao":0,"estoque_atual":25,"estoque_minimo":5,"ativo":true},
  {"id":"prod_778","codigo":"1-601","nome":"ROLO ATLAS ANTI RESPINGO LA SINTETICA  9 CM","categoria":"Ferramentas & Acessórios","especie":"Aço / Ferramental","tipo_calculo":"UN","unidade_medida":"UN","preco_unitario":8.4,"taxa_plaina_padrao":0,"estoque_atual":25,"estoque_minimo":5,"ativo":true},
  {"id":"prod_779","codigo":"1-602","nome":"ROLO ATLAS ANTI RESPINGO LA SINTETICA 15 CM C/CABO","categoria":"Ferramentas & Acessórios","especie":"Aço / Ferramental","tipo_calculo":"UN","unidade_medida":"UN","preco_unitario":10.4,"taxa_plaina_padrao":0,"estoque_atual":25,"estoque_minimo":5,"ativo":true},
  {"id":"prod_780","codigo":"1-603","nome":"ROLO ATLAS ANTI RESPINGO LA SINTETICA 5 CM C/CABO","categoria":"Ferramentas & Acessórios","especie":"Aço / Ferramental","tipo_calculo":"UN","unidade_medida":"UN","preco_unitario":7.5,"taxa_plaina_padrao":0,"estoque_atual":25,"estoque_minimo":5,"ativo":true},
  {"id":"prod_781","codigo":"1-604","nome":"ROLO DE ESPUMA 23 CM S/C COMPEL","categoria":"Ferramentas & Acessórios","especie":"Aço / Ferramental","tipo_calculo":"UN","unidade_medida":"UN","preco_unitario":9,"taxa_plaina_padrao":0,"estoque_atual":25,"estoque_minimo":5,"ativo":true},
  {"id":"prod_782","codigo":"1-605","nome":"ROLO ESPUMA 05 CM POP COMPEL","categoria":"Ferramentas & Acessórios","especie":"Aço / Ferramental","tipo_calculo":"UN","unidade_medida":"UN","preco_unitario":4.4,"taxa_plaina_padrao":0,"estoque_atual":25,"estoque_minimo":5,"ativo":true},
  {"id":"prod_783","codigo":"1-606","nome":"ROLO ESPUMA 09 CM POP COMPEL","categoria":"Ferramentas & Acessórios","especie":"Aço / Ferramental","tipo_calculo":"UN","unidade_medida":"UN","preco_unitario":6.4,"taxa_plaina_padrao":0,"estoque_atual":25,"estoque_minimo":5,"ativo":true},
  {"id":"prod_784","codigo":"1-607","nome":"ROLO PITURA ESPUMA 15 CM CONDOR","categoria":"Ferramentas & Acessórios","especie":"Aço / Ferramental","tipo_calculo":"UN","unidade_medida":"UN","preco_unitario":7.4,"taxa_plaina_padrao":0,"estoque_atual":25,"estoque_minimo":5,"ativo":true},
  {"id":"prod_785","codigo":"MAT-785","nome":"SACO P/ ENTULHO 50 KG","categoria":"EPIs, Cordas & Diversos","especie":"Aço","tipo_calculo":"UN","unidade_medida":"UN","preco_unitario":5,"taxa_plaina_padrao":0,"estoque_atual":40,"estoque_minimo":10,"ativo":true},
  {"id":"prod_786","codigo":"1-608","nome":"SAIDA MAQUINA  1,40 M PLASTIC","categoria":"Hidráulica & Conexões","especie":"PVC / Metal","tipo_calculo":"UN","unidade_medida":"UN","preco_unitario":6.4,"taxa_plaina_padrao":0,"estoque_atual":70,"estoque_minimo":20,"ativo":true},
  {"id":"prod_787","codigo":"1-609","nome":"SAIDA TANQUINHO 1,27 M PLASTIC","categoria":"Hidráulica & Conexões","especie":"PVC / Metal","tipo_calculo":"UN","unidade_medida":"UN","preco_unitario":5.9,"taxa_plaina_padrao":0,"estoque_atual":70,"estoque_minimo":20,"ativo":true},
  {"id":"prod_788","codigo":"1-610","nome":"SARGENTO GRAMPO AÇO Nº 2 BRASFORT","categoria":"Ferramentas & Acessórios","especie":"Aço","tipo_calculo":"UN","unidade_medida":"UN","preco_unitario":14.2,"taxa_plaina_padrao":0,"estoque_atual":25,"estoque_minimo":5,"ativo":true},
  {"id":"prod_789","codigo":"1-611","nome":"SARGENTO GRAMPO AÇO Nº 3 BRASFORT","categoria":"Ferramentas & Acessórios","especie":"Aço","tipo_calculo":"UN","unidade_medida":"UN","preco_unitario":21,"taxa_plaina_padrao":0,"estoque_atual":25,"estoque_minimo":5,"ativo":true},
  {"id":"prod_790","codigo":"1-612","nome":"SARGENTO GRAMPO AÇO Nº 4 BRASFORT","categoria":"Ferramentas & Acessórios","especie":"Aço","tipo_calculo":"UN","unidade_medida":"UN","preco_unitario":39,"taxa_plaina_padrao":0,"estoque_atual":25,"estoque_minimo":5,"ativo":true},
  {"id":"prod_791","codigo":"1-613","nome":"SARGENTO GRAMPO AÇO Nº 6 STARFER","categoria":"Ferramentas & Acessórios","especie":"Aço","tipo_calculo":"UN","unidade_medida":"UN","preco_unitario":55.4,"taxa_plaina_padrao":0,"estoque_atual":25,"estoque_minimo":5,"ativo":true},
  {"id":"prod_792","codigo":"1-614","nome":"SARGENTO GRAMPO AÇO Nº 8 STARFER","categoria":"Ferramentas & Acessórios","especie":"Aço","tipo_calculo":"UN","unidade_medida":"UN","preco_unitario":78.6,"taxa_plaina_padrao":0,"estoque_atual":25,"estoque_minimo":5,"ativo":true},
  {"id":"prod_793","codigo":"MAT-793","nome":"SERRA CIRCULAR VIDEA 7\" 1/4 180MM 40DTS COMBATT","categoria":"Ferramentas & Acessórios","especie":"Aço / Ferramental","tipo_calculo":"UN","unidade_medida":"UN","preco_unitario":30.9,"taxa_plaina_padrao":0,"estoque_atual":25,"estoque_minimo":5,"ativo":true},
  {"id":"prod_794","codigo":"1-616","nome":"SERRINHA 18 T STARRET","categoria":"Ferramentas & Acessórios","especie":"Aço / Ferramental","tipo_calculo":"UN","unidade_medida":"UN","preco_unitario":14.4,"taxa_plaina_padrao":0,"estoque_atual":25,"estoque_minimo":5,"ativo":true},
  {"id":"prod_795","codigo":"1-617","nome":"SERRINHA 24 T  GCORTE","categoria":"Ferramentas & Acessórios","especie":"Aço / Ferramental","tipo_calculo":"UN","unidade_medida":"UN","preco_unitario":11,"taxa_plaina_padrao":0,"estoque_atual":25,"estoque_minimo":5,"ativo":true},
  {"id":"prod_796","codigo":"1-618","nome":"SERROTE RAMADA HOBBY 18","categoria":"Ferramentas & Acessórios","especie":"Aço / Ferramental","tipo_calculo":"UN","unidade_medida":"UN","preco_unitario":41.4,"taxa_plaina_padrao":0,"estoque_atual":25,"estoque_minimo":5,"ativo":true},
  {"id":"prod_797","codigo":"1-619","nome":"SERROTE RAMADA HOBBY 20","categoria":"Ferramentas & Acessórios","especie":"Aço / Ferramental","tipo_calculo":"UN","unidade_medida":"UN","preco_unitario":47.8,"taxa_plaina_padrao":0,"estoque_atual":25,"estoque_minimo":5,"ativo":true},
  {"id":"prod_798","codigo":"1-620","nome":"SIFÃO COPO UNIV BRANCO ASTRA SSUC BR1","categoria":"Hidráulica & Conexões","especie":"PVC / Metal","tipo_calculo":"UN","unidade_medida":"UN","preco_unitario":13.4,"taxa_plaina_padrao":0,"estoque_atual":70,"estoque_minimo":20,"ativo":true},
  {"id":"prod_799","codigo":"1-621","nome":"SIFÃO EXTENSIVEL DUPLO DELFLEX","categoria":"Hidráulica & Conexões","especie":"PVC / Metal","tipo_calculo":"UN","unidade_medida":"UN","preco_unitario":17,"taxa_plaina_padrao":0,"estoque_atual":70,"estoque_minimo":20,"ativo":true},
  {"id":"prod_800","codigo":"1-622","nome":"SIFÃO EXTENSIVEL LONGA DELFLEX 1,20","categoria":"Hidráulica & Conexões","especie":"PVC / Metal","tipo_calculo":"UN","unidade_medida":"UN","preco_unitario":20.1,"taxa_plaina_padrao":0,"estoque_atual":70,"estoque_minimo":20,"ativo":true},
  {"id":"prod_801","codigo":"1-623","nome":"SIFÃO EXTENSIVEL METALIZADO DELFLEX","categoria":"Hidráulica & Conexões","especie":"PVC / Metal","tipo_calculo":"UN","unidade_medida":"UN","preco_unitario":22,"taxa_plaina_padrao":0,"estoque_atual":70,"estoque_minimo":20,"ativo":true},
  {"id":"prod_802","codigo":"1-624","nome":"SIFÃO EXTENSIVEL SIMPLES DELFLX 70 CM","categoria":"Hidráulica & Conexões","especie":"PVC / Metal","tipo_calculo":"UN","unidade_medida":"UN","preco_unitario":9.3,"taxa_plaina_padrao":0,"estoque_atual":70,"estoque_minimo":20,"ativo":true},
  {"id":"prod_803","codigo":"1-625","nome":"SILICONE TEK BOND 256 G TRANSPARENTE","categoria":"Tintas & Química","especie":"Químico","tipo_calculo":"UN","unidade_medida":"UN","preco_unitario":20.4,"taxa_plaina_padrao":0,"estoque_atual":35,"estoque_minimo":10,"ativo":true},
  {"id":"prod_804","codigo":"1-626","nome":"SILICONE TEK BOND 50 G TRANSPARENTE","categoria":"Tintas & Química","especie":"Químico","tipo_calculo":"UN","unidade_medida":"UN","preco_unitario":8,"taxa_plaina_padrao":0,"estoque_atual":35,"estoque_minimo":10,"ativo":true},
  {"id":"prod_805","codigo":"MAT-805","nome":"SOQUETE ADAPTADOR E27 DECORLUX C/ PLUG MACHO","categoria":"Elétrica & Iluminação","especie":"Cobre / Termoplástico","tipo_calculo":"UN","unidade_medida":"UN","preco_unitario":12.8,"taxa_plaina_padrao":0,"estoque_atual":55,"estoque_minimo":15,"ativo":true},
  {"id":"prod_806","codigo":"1-629","nome":"SOQUETE C/ RABICHO BRASFORT","categoria":"Elétrica & Iluminação","especie":"Cobre / Termoplástico","tipo_calculo":"UN","unidade_medida":"UN","preco_unitario":3.75,"taxa_plaina_padrao":0,"estoque_atual":55,"estoque_minimo":15,"ativo":true},
  {"id":"prod_807","codigo":"1-628","nome":"SOQUETE COM PINO PRETO","categoria":"Elétrica & Iluminação","especie":"Cobre / Termoplástico","tipo_calculo":"UN","unidade_medida":"UN","preco_unitario":3.45,"taxa_plaina_padrao":0,"estoque_atual":55,"estoque_minimo":15,"ativo":true},
  {"id":"prod_808","codigo":"MAT-808","nome":"SOQUETE COM RABICHO BRANCO","categoria":"Elétrica & Iluminação","especie":"Cobre / Termoplástico","tipo_calculo":"UN","unidade_medida":"UN","preco_unitario":4,"taxa_plaina_padrao":0,"estoque_atual":55,"estoque_minimo":15,"ativo":true},
  {"id":"prod_809","codigo":"1-630","nome":"SOQUETE E27  PORCELANA BRANCO PLAFON","categoria":"Elétrica & Iluminação","especie":"Porcelana","tipo_calculo":"UN","unidade_medida":"UN","preco_unitario":6.24,"taxa_plaina_padrao":0,"estoque_atual":55,"estoque_minimo":15,"ativo":true},
  {"id":"prod_810","codigo":"1-631","nome":"SOQUETE E27 PORCELANA PRETA PLAFON","categoria":"Elétrica & Iluminação","especie":"Porcelana","tipo_calculo":"UN","unidade_medida":"UN","preco_unitario":6.24,"taxa_plaina_padrao":0,"estoque_atual":55,"estoque_minimo":15,"ativo":true},
  {"id":"prod_811","codigo":"1-627","nome":"SOQUETE PORTA LAMPADA C/INTERRUPTOR","categoria":"Elétrica & Iluminação","especie":"Cobre / Termoplástico","tipo_calculo":"UN","unidade_medida":"UN","preco_unitario":10.35,"taxa_plaina_padrao":0,"estoque_atual":55,"estoque_minimo":15,"ativo":true},
  {"id":"prod_812","codigo":"1-632","nome":"SPRAY LUMINOSO AMARELO 400 ML LEV&UZE","categoria":"Tintas & Química","especie":"Químico","tipo_calculo":"UN","unidade_medida":"UN","preco_unitario":18,"taxa_plaina_padrao":0,"estoque_atual":35,"estoque_minimo":10,"ativo":true},
  {"id":"prod_813","codigo":"1-633","nome":"SPRAY USO GERAL PRETO BRILHANTE 400 ML PEG&UZE","categoria":"Tintas & Química","especie":"Químico","tipo_calculo":"UN","unidade_medida":"UN","preco_unitario":19.5,"taxa_plaina_padrao":0,"estoque_atual":35,"estoque_minimo":10,"ativo":true},
  {"id":"prod_814","codigo":"1-634","nome":"SUPORT ROLO PINTURA 23 GAIOLA TIGRE","categoria":"Ferramentas & Acessórios","especie":"Aço / Ferramental","tipo_calculo":"UN","unidade_medida":"UN","preco_unitario":11.6,"taxa_plaina_padrao":0,"estoque_atual":25,"estoque_minimo":5,"ativo":true},
  {"id":"prod_815","codigo":"1-635","nome":"SUPORTE 15 CM / 13,5 CM","categoria":"Ferragens & Cercas","especie":"Aço Galvanizado","tipo_calculo":"UN","unidade_medida":"UN","preco_unitario":7.4,"taxa_plaina_padrao":0,"estoque_atual":45,"estoque_minimo":10,"ativo":true},
  {"id":"prod_816","codigo":"1-636","nome":"SUPORTE 20 CM / 18,5 CM","categoria":"Ferragens & Cercas","especie":"Aço Galvanizado","tipo_calculo":"UN","unidade_medida":"UN","preco_unitario":8,"taxa_plaina_padrao":0,"estoque_atual":45,"estoque_minimo":10,"ativo":true},
  {"id":"prod_817","codigo":"1-637","nome":"SUPORTE 25 CM / 23 CM","categoria":"Ferragens & Cercas","especie":"Aço Galvanizado","tipo_calculo":"UN","unidade_medida":"UN","preco_unitario":8.6,"taxa_plaina_padrao":0,"estoque_atual":45,"estoque_minimo":10,"ativo":true},
  {"id":"prod_818","codigo":"1-638","nome":"SUPORTE 30 CM / 27CM","categoria":"Ferragens & Cercas","especie":"Aço Galvanizado","tipo_calculo":"UN","unidade_medida":"UN","preco_unitario":9.4,"taxa_plaina_padrao":0,"estoque_atual":45,"estoque_minimo":10,"ativo":true},
  {"id":"prod_819","codigo":"MAT-819","nome":"SUPORTE PARA CADEADO 2 1/2\" 1 PÇ","categoria":"Ferragens & Cercas","especie":"Aço Galvanizado","tipo_calculo":"UN","unidade_medida":"UN","preco_unitario":9.6,"taxa_plaina_padrao":0,"estoque_atual":45,"estoque_minimo":10,"ativo":true},
  {"id":"prod_820","codigo":"MAT-820","nome":"SUPORTE PARA CADEADO 2\" 1 PÇ","categoria":"Ferragens & Cercas","especie":"Aço Galvanizado","tipo_calculo":"UN","unidade_medida":"UN","preco_unitario":8.2,"taxa_plaina_padrao":0,"estoque_atual":45,"estoque_minimo":10,"ativo":true},
  {"id":"prod_821","codigo":"MAT-821","nome":"SUPORTE PARA CADEADO 3 1/2\" 1 PÇ","categoria":"Ferragens & Cercas","especie":"Aço Galvanizado","tipo_calculo":"UN","unidade_medida":"UN","preco_unitario":17.4,"taxa_plaina_padrao":0,"estoque_atual":45,"estoque_minimo":10,"ativo":true},
  {"id":"prod_822","codigo":"T-646","nome":"TABUA EUCALIPTO 11 CM","categoria":"Madeiras & Esquadrias","especie":"Eucalipto","tipo_calculo":"ML","unidade_medida":"ML","preco_unitario":6,"taxa_plaina_padrao":3.5,"estoque_atual":60,"estoque_minimo":20,"ativo":true,"comprimentos_comuns":[2.5,3,3.5,4]},
  {"id":"prod_823","codigo":"T-647","nome":"TABUA EUCALIPTO 15 CM","categoria":"Madeiras & Esquadrias","especie":"Eucalipto","tipo_calculo":"ML","unidade_medida":"ML","preco_unitario":8.55,"taxa_plaina_padrao":3.5,"estoque_atual":60,"estoque_minimo":20,"ativo":true,"comprimentos_comuns":[2.5,3,3.5,4]},
  {"id":"prod_824","codigo":"T-648","nome":"TABUA EUCALIPTO 20CM","categoria":"Madeiras & Esquadrias","especie":"Eucalipto","tipo_calculo":"ML","unidade_medida":"ML","preco_unitario":11.4,"taxa_plaina_padrao":3.5,"estoque_atual":60,"estoque_minimo":20,"ativo":true,"comprimentos_comuns":[2.5,3,3.5,4]},
  {"id":"prod_825","codigo":"T-649","nome":"TABUA MESCLA 15CM","categoria":"Madeiras & Esquadrias","especie":"Mescla","tipo_calculo":"ML","unidade_medida":"ML","preco_unitario":13.01,"taxa_plaina_padrao":3.5,"estoque_atual":60,"estoque_minimo":20,"ativo":true,"comprimentos_comuns":[2.5,3,3.5,4]},
  {"id":"prod_826","codigo":"T-650","nome":"TABUA MESCLA 20CM","categoria":"Madeiras & Esquadrias","especie":"Mescla","tipo_calculo":"ML","unidade_medida":"ML","preco_unitario":18,"taxa_plaina_padrao":3.5,"estoque_atual":60,"estoque_minimo":20,"ativo":true,"comprimentos_comuns":[2.5,3,3.5,4]},
  {"id":"prod_827","codigo":"T-651","nome":"TABUA MESCLA 30CM","categoria":"Madeiras & Esquadrias","especie":"Mescla","tipo_calculo":"ML","unidade_medida":"ML","preco_unitario":27,"taxa_plaina_padrao":3.5,"estoque_atual":60,"estoque_minimo":20,"ativo":true,"comprimentos_comuns":[2.5,3,3.5,4]},
  {"id":"prod_828","codigo":"T-652","nome":"TABUA PINUA 5CM X 3MTS","categoria":"Madeiras & Esquadrias","especie":"Diversos","tipo_calculo":"ML","unidade_medida":"ML","preco_unitario":2.4,"taxa_plaina_padrao":3.5,"estoque_atual":60,"estoque_minimo":20,"ativo":true,"comprimentos_comuns":[2.5,3,3.5,4]},
  {"id":"prod_829","codigo":"T-653","nome":"TABUA PINUS 10CM X 3MTS","categoria":"Madeiras & Esquadrias","especie":"Pinus","tipo_calculo":"ML","unidade_medida":"ML","preco_unitario":3.6,"taxa_plaina_padrao":3.5,"estoque_atual":60,"estoque_minimo":20,"ativo":true,"comprimentos_comuns":[2.5,3,3.5,4]},
  {"id":"prod_830","codigo":"T-654","nome":"TABUA PINUS 15CM X 3MTS","categoria":"Madeiras & Esquadrias","especie":"Pinus","tipo_calculo":"ML","unidade_medida":"ML","preco_unitario":5.1,"taxa_plaina_padrao":3.5,"estoque_atual":60,"estoque_minimo":20,"ativo":true,"comprimentos_comuns":[2.5,3,3.5,4]},
  {"id":"prod_831","codigo":"T-655","nome":"TABUA PINUS 20CM X 3MTS","categoria":"Madeiras & Esquadrias","especie":"Pinus","tipo_calculo":"ML","unidade_medida":"ML","preco_unitario":6.9,"taxa_plaina_padrao":3.5,"estoque_atual":60,"estoque_minimo":20,"ativo":true,"comprimentos_comuns":[2.5,3,3.5,4]},
  {"id":"prod_832","codigo":"T-656","nome":"TABUA PINUS 25CM X 3MTS","categoria":"Madeiras & Esquadrias","especie":"Pinus","tipo_calculo":"ML","unidade_medida":"ML","preco_unitario":8.7,"taxa_plaina_padrao":3.5,"estoque_atual":60,"estoque_minimo":20,"ativo":true,"comprimentos_comuns":[2.5,3,3.5,4]},
  {"id":"prod_833","codigo":"T-657","nome":"TABUA PINUS 30CM X 3MTS","categoria":"Madeiras & Esquadrias","especie":"Pinus","tipo_calculo":"ML","unidade_medida":"ML","preco_unitario":13.5,"taxa_plaina_padrao":3.5,"estoque_atual":60,"estoque_minimo":20,"ativo":true,"comprimentos_comuns":[2.5,3,3.5,4]},
  {"id":"prod_834","codigo":"MAT-834","nome":"TAIME","categoria":"Elétrica & Iluminação","especie":"Cobre / Termoplástico","tipo_calculo":"UN","unidade_medida":"UN","preco_unitario":42,"taxa_plaina_padrao":0,"estoque_atual":55,"estoque_minimo":15,"ativo":true},
  {"id":"prod_835","codigo":"T-658","nome":"TAMPA P/ TANQUE E VALATORIO","categoria":"Hidráulica & Conexões","especie":"PVC / Metal","tipo_calculo":"UN","unidade_medida":"UN","preco_unitario":0.8,"taxa_plaina_padrao":0,"estoque_atual":70,"estoque_minimo":20,"ativo":true},
  {"id":"prod_836","codigo":"MAT-836","nome":"TAMPA P/ TANQUE PLASTICO","categoria":"Hidráulica & Conexões","especie":"PVC / Metal","tipo_calculo":"UN","unidade_medida":"UN","preco_unitario":0.8,"taxa_plaina_padrao":0,"estoque_atual":70,"estoque_minimo":20,"ativo":true},
  {"id":"prod_837","codigo":"MAT-837","nome":"TAMPA P/TANQUE","categoria":"Hidráulica & Conexões","especie":"PVC / Metal","tipo_calculo":"UN","unidade_medida":"UN","preco_unitario":0.8,"taxa_plaina_padrao":0,"estoque_atual":70,"estoque_minimo":20,"ativo":true},
  {"id":"prod_838","codigo":"MAT-838","nome":"TAMPÃO CAP ESG PRIM 100 PLASTUBOS","categoria":"Hidráulica & Conexões","especie":"PVC / Metal","tipo_calculo":"UN","unidade_medida":"UN","preco_unitario":8.7,"taxa_plaina_padrao":0,"estoque_atual":70,"estoque_minimo":20,"ativo":true},
  {"id":"prod_839","codigo":"MAT-839","nome":"TAMPÃO CAP ESG PRIM 50 PLASTUBOS","categoria":"Hidráulica & Conexões","especie":"PVC / Metal","tipo_calculo":"UN","unidade_medida":"UN","preco_unitario":3.6,"taxa_plaina_padrao":0,"estoque_atual":70,"estoque_minimo":20,"ativo":true},
  {"id":"prod_840","codigo":"MAT-840","nome":"TAMPÃO CAP SOLD 20MM PLASTUBOS","categoria":"Hidráulica & Conexões","especie":"PVC / Metal","tipo_calculo":"UN","unidade_medida":"UN","preco_unitario":1.2,"taxa_plaina_padrao":0,"estoque_atual":70,"estoque_minimo":20,"ativo":true},
  {"id":"prod_841","codigo":"MAT-841","nome":"TAMPÃO CAP SOLD 25MM PLASTUBOS","categoria":"Hidráulica & Conexões","especie":"PVC / Metal","tipo_calculo":"UN","unidade_medida":"UN","preco_unitario":1.4,"taxa_plaina_padrao":0,"estoque_atual":70,"estoque_minimo":20,"ativo":true},
  {"id":"prod_842","codigo":"MAT-842","nome":"TAMPÃO CAP SOLD 50MM PLASTUBOS","categoria":"Hidráulica & Conexões","especie":"PVC / Metal","tipo_calculo":"UN","unidade_medida":"UN","preco_unitario":5.8,"taxa_plaina_padrao":0,"estoque_atual":70,"estoque_minimo":20,"ativo":true},
  {"id":"prod_843","codigo":"T-659","nome":"TAMPÃO ESGOTO 100 MM","categoria":"Hidráulica & Conexões","especie":"PVC / Metal","tipo_calculo":"UN","unidade_medida":"UN","preco_unitario":8.7,"taxa_plaina_padrao":0,"estoque_atual":70,"estoque_minimo":20,"ativo":true},
  {"id":"prod_844","codigo":"T-660","nome":"TAMPÃO ESGOTO 50 MM","categoria":"Hidráulica & Conexões","especie":"PVC / Metal","tipo_calculo":"UN","unidade_medida":"UN","preco_unitario":3.6,"taxa_plaina_padrao":0,"estoque_atual":70,"estoque_minimo":20,"ativo":true},
  {"id":"prod_845","codigo":"T-661","nome":"TAMPÃO SOLD 20MM","categoria":"Hidráulica & Conexões","especie":"PVC / Metal","tipo_calculo":"UN","unidade_medida":"UN","preco_unitario":1.2,"taxa_plaina_padrao":0,"estoque_atual":70,"estoque_minimo":20,"ativo":true},
  {"id":"prod_846","codigo":"T-662","nome":"TAMPÃO SOLD 25MM","categoria":"Hidráulica & Conexões","especie":"PVC / Metal","tipo_calculo":"UN","unidade_medida":"UN","preco_unitario":1.4,"taxa_plaina_padrao":0,"estoque_atual":70,"estoque_minimo":20,"ativo":true},
  {"id":"prod_847","codigo":"T-663","nome":"TAMPÃO SOLD 50MM","categoria":"Hidráulica & Conexões","especie":"PVC / Metal","tipo_calculo":"UN","unidade_medida":"UN","preco_unitario":5.8,"taxa_plaina_padrao":0,"estoque_atual":70,"estoque_minimo":20,"ativo":true},
  {"id":"prod_848","codigo":"T-664","nome":"TANQUE CIMENTO","categoria":"Construção & Alvenaria","especie":"Concreto","tipo_calculo":"UN","unidade_medida":"UN","preco_unitario":285,"taxa_plaina_padrao":0,"estoque_atual":8,"estoque_minimo":2,"ativo":true},
  {"id":"prod_849","codigo":"T-665","nome":"TE 1/2 INTERNO TRIPLO PRETO PLASBOHN PÇ","categoria":"Hidráulica & Conexões","especie":"PVC / Metal","tipo_calculo":"UN","unidade_medida":"UN","preco_unitario":1.5,"taxa_plaina_padrao":0,"estoque_atual":70,"estoque_minimo":20,"ativo":true},
  {"id":"prod_850","codigo":"T-666","nome":"TE 3/4 INTERNO TRIPLO PRETO PLASBOHN PÇ","categoria":"Hidráulica & Conexões","especie":"PVC / Metal","tipo_calculo":"UN","unidade_medida":"UN","preco_unitario":1.8,"taxa_plaina_padrao":0,"estoque_atual":70,"estoque_minimo":20,"ativo":true},
  {"id":"prod_851","codigo":"MAT-851","nome":"TE ESG 100X100MM PLASTUBOS","categoria":"Hidráulica & Conexões","especie":"PVC / Metal","tipo_calculo":"UN","unidade_medida":"UN","preco_unitario":12.8,"taxa_plaina_padrao":0,"estoque_atual":70,"estoque_minimo":20,"ativo":true},
  {"id":"prod_852","codigo":"MAT-852","nome":"TE ESG 100X50MM PLASTUBOS","categoria":"Hidráulica & Conexões","especie":"PVC / Metal","tipo_calculo":"UN","unidade_medida":"UN","preco_unitario":12.9,"taxa_plaina_padrao":0,"estoque_atual":70,"estoque_minimo":20,"ativo":true},
  {"id":"prod_853","codigo":"T-669","nome":"TE ESG 50X50MM PLASTUBOS","categoria":"Hidráulica & Conexões","especie":"PVC / Metal","tipo_calculo":"UN","unidade_medida":"UN","preco_unitario":7.8,"taxa_plaina_padrao":0,"estoque_atual":70,"estoque_minimo":20,"ativo":true},
  {"id":"prod_854","codigo":"T-670","nome":"TE ESG SOLD 25X20MM PLASTUBOS","categoria":"Hidráulica & Conexões","especie":"PVC / Metal","tipo_calculo":"UN","unidade_medida":"UN","preco_unitario":4,"taxa_plaina_padrao":0,"estoque_atual":70,"estoque_minimo":20,"ativo":true},
  {"id":"prod_855","codigo":"T-667","nome":"TE ESGOTO 100MM","categoria":"Hidráulica & Conexões","especie":"PVC / Metal","tipo_calculo":"UN","unidade_medida":"UN","preco_unitario":12.8,"taxa_plaina_padrao":0,"estoque_atual":70,"estoque_minimo":20,"ativo":true},
  {"id":"prod_856","codigo":"T-668","nome":"TE ESGOTO 50MM PLASTUBOS","categoria":"Hidráulica & Conexões","especie":"PVC / Metal","tipo_calculo":"UN","unidade_medida":"UN","preco_unitario":7.8,"taxa_plaina_padrao":0,"estoque_atual":70,"estoque_minimo":20,"ativo":true},
  {"id":"prod_857","codigo":"T-671","nome":"TE RED SOLD 50X25MM PLASTUBOS","categoria":"Hidráulica & Conexões","especie":"PVC / Metal","tipo_calculo":"UN","unidade_medida":"UN","preco_unitario":7.8,"taxa_plaina_padrao":0,"estoque_atual":70,"estoque_minimo":20,"ativo":true},
  {"id":"prod_858","codigo":"T-672","nome":"TE ROSCA 1/2 INTERNO PRETO PLASBOHN  PÇ","categoria":"Hidráulica & Conexões","especie":"PVC / Metal","tipo_calculo":"UN","unidade_medida":"UN","preco_unitario":1.2,"taxa_plaina_padrao":0,"estoque_atual":70,"estoque_minimo":20,"ativo":true},
  {"id":"prod_859","codigo":"T-673","nome":"TE ROSCA 3/4 INTERNO PRETO PLASBOHN  PÇ","categoria":"Hidráulica & Conexões","especie":"PVC / Metal","tipo_calculo":"UN","unidade_medida":"UN","preco_unitario":2,"taxa_plaina_padrao":0,"estoque_atual":70,"estoque_minimo":20,"ativo":true},
  {"id":"prod_860","codigo":"T-674","nome":"TE SOLD 25MM PLASTUBOS","categoria":"Hidráulica & Conexões","especie":"PVC / Metal","tipo_calculo":"UN","unidade_medida":"UN","preco_unitario":1.2,"taxa_plaina_padrao":0,"estoque_atual":70,"estoque_minimo":20,"ativo":true},
  {"id":"prod_861","codigo":"T-675","nome":"TE SOLD 50MM PLASTUBOS","categoria":"Hidráulica & Conexões","especie":"PVC / Metal","tipo_calculo":"UN","unidade_medida":"UN","preco_unitario":8.7,"taxa_plaina_padrao":0,"estoque_atual":70,"estoque_minimo":20,"ativo":true},
  {"id":"prod_862","codigo":"T-676","nome":"TELA ALAMBRADO FIO 12 MALHA 2. 1/2 X 1,50 ROLO 30M","categoria":"Ferragens & Cercas","especie":"Aço Galvanizado","tipo_calculo":"UN","unidade_medida":"UN","preco_unitario":47.25,"taxa_plaina_padrao":0,"estoque_atual":45,"estoque_minimo":10,"ativo":true},
  {"id":"prod_863","codigo":"T-677","nome":"TELA ALAMBRADO FIO 14 MALHA 2. 1/2 X1,50 ROLO 30M","categoria":"Ferragens & Cercas","especie":"Aço Galvanizado","tipo_calculo":"UN","unidade_medida":"UN","preco_unitario":31.5,"taxa_plaina_padrao":0,"estoque_atual":45,"estoque_minimo":10,"ativo":true},
  {"id":"prod_864","codigo":"MAT-864","nome":"TELA ALAMBRADO GAL. FIO 12 MALHA 2.1/2 X 1,50 ROLO 30 M","categoria":"Ferragens & Cercas","especie":"Aço Galvanizado","tipo_calculo":"UN","unidade_medida":"UN","preco_unitario":43.5,"taxa_plaina_padrao":0,"estoque_atual":45,"estoque_minimo":10,"ativo":true},
  {"id":"prod_865","codigo":"MAT-865","nome":"TELA ALAMBRADO GAL. FIO 14 MALHA 2.1/2 X 1,50 ROLO 30 M","categoria":"Ferragens & Cercas","especie":"Aço Galvanizado","tipo_calculo":"UN","unidade_medida":"UN","preco_unitario":30,"taxa_plaina_padrao":0,"estoque_atual":45,"estoque_minimo":10,"ativo":true},
  {"id":"prod_866","codigo":"T-678","nome":"TELA GALINHEIRO 22 X 1 X 1 MTS ALTURA ROLO 50 M","categoria":"Ferragens & Cercas","especie":"Aço Galvanizado","tipo_calculo":"UN","unidade_medida":"UN","preco_unitario":7.5,"taxa_plaina_padrao":0,"estoque_atual":45,"estoque_minimo":10,"ativo":true},
  {"id":"prod_867","codigo":"MAT-867","nome":"TELA GALINHEIRO 22X1X1.00 M ALTURA ROLO 50 M","categoria":"Ferragens & Cercas","especie":"Aço Galvanizado","tipo_calculo":"UN","unidade_medida":"UN","preco_unitario":9.8,"taxa_plaina_padrao":0,"estoque_atual":45,"estoque_minimo":10,"ativo":true},
  {"id":"prod_868","codigo":"T-679","nome":"TELA VIVEIRO FIO 24 MALHA 1/2 X 1,50 X ROLO 50 M","categoria":"Ferragens & Cercas","especie":"Aço Galvanizado","tipo_calculo":"UN","unidade_medida":"UN","preco_unitario":17.1,"taxa_plaina_padrao":0,"estoque_atual":45,"estoque_minimo":10,"ativo":true},
  {"id":"prod_869","codigo":"MAT-869","nome":"TELHA BARRO BELO AMERICANA","categoria":"Telhas & Coberturas","especie":"Cerâmica","tipo_calculo":"UN","unidade_medida":"UN","preco_unitario":2.6,"taxa_plaina_padrao":0,"estoque_atual":850,"estoque_minimo":150,"ativo":true},
  {"id":"prod_870","codigo":"T-681","nome":"TELHA BARRO BELO PORTUGUESA E ROMANA RESINADA CADA","categoria":"Telhas & Coberturas","especie":"Cerâmica","tipo_calculo":"UN","unidade_medida":"UN","preco_unitario":1.9,"taxa_plaina_padrao":0,"estoque_atual":850,"estoque_minimo":150,"ativo":true},
  {"id":"prod_871","codigo":"T-682","nome":"TELHA COLONIAL PVC 2,30X0,86 INFIBRA","categoria":"Telhas & Coberturas","especie":"PVC","tipo_calculo":"UN","unidade_medida":"UN","preco_unitario":151.5,"taxa_plaina_padrao":0,"estoque_atual":850,"estoque_minimo":150,"ativo":true},
  {"id":"prod_872","codigo":"T-683","nome":"TELHA CUNHEIRA  COLONIAL 3 POR 1M","categoria":"Telhas & Coberturas","especie":"Diversos","tipo_calculo":"UN","unidade_medida":"UN","preco_unitario":4.2,"taxa_plaina_padrao":0,"estoque_atual":850,"estoque_minimo":150,"ativo":true},
  {"id":"prod_873","codigo":"T-684","nome":"TELHA CUNHEIRA ARTICULADA 110 (PAR)","categoria":"Telhas & Coberturas","especie":"Diversos","tipo_calculo":"UN","unidade_medida":"UN","preco_unitario":71.2,"taxa_plaina_padrao":0,"estoque_atual":850,"estoque_minimo":150,"ativo":true},
  {"id":"prod_874","codigo":"T-685","nome":"TELHA CUNHEIRA NORMAL 110 6MM 15 GRAUS","categoria":"Telhas & Coberturas","especie":"Diversos","tipo_calculo":"UN","unidade_medida":"UN","preco_unitario":52.5,"taxa_plaina_padrao":0,"estoque_atual":850,"estoque_minimo":150,"ativo":true},
  {"id":"prod_875","codigo":"T-686","nome":"TELHA INFIBRA 1.83 X 110 5 MM","categoria":"Telhas & Coberturas","especie":"Fibrocimento","tipo_calculo":"UN","unidade_medida":"UN","preco_unitario":56.7,"taxa_plaina_padrao":0,"estoque_atual":850,"estoque_minimo":150,"ativo":true},
  {"id":"prod_876","codigo":"T-687","nome":"TELHA INFIBRA 244 X 110 5MM","categoria":"Telhas & Coberturas","especie":"Fibrocimento","tipo_calculo":"UN","unidade_medida":"UN","preco_unitario":64.5,"taxa_plaina_padrao":0,"estoque_atual":850,"estoque_minimo":150,"ativo":true},
  {"id":"prod_877","codigo":"T-688","nome":"TELHA INFIBRA 244 X 50 4MM","categoria":"Telhas & Coberturas","especie":"Fibrocimento","tipo_calculo":"UN","unidade_medida":"UN","preco_unitario":29.7,"taxa_plaina_padrao":0,"estoque_atual":850,"estoque_minimo":150,"ativo":true},
  {"id":"prod_878","codigo":"T-689","nome":"TELHA INFIBRA 305 X 110 6MM","categoria":"Telhas & Coberturas","especie":"Fibrocimento","tipo_calculo":"UN","unidade_medida":"UN","preco_unitario":117.6,"taxa_plaina_padrao":0,"estoque_atual":850,"estoque_minimo":150,"ativo":true},
  {"id":"prod_879","codigo":"T-690","nome":"TELHA INFIBRA 366 X 110 6 MM","categoria":"Telhas & Coberturas","especie":"Fibrocimento","tipo_calculo":"UN","unidade_medida":"UN","preco_unitario":139.2,"taxa_plaina_padrao":0,"estoque_atual":850,"estoque_minimo":150,"ativo":true},
  {"id":"prod_880","codigo":"T-693","nome":"TELHA LEITOSA BRANCA 244X110","categoria":"Telhas & Coberturas","especie":"Diversos","tipo_calculo":"UN","unidade_medida":"UN","preco_unitario":124.5,"taxa_plaina_padrao":0,"estoque_atual":850,"estoque_minimo":150,"ativo":true},
  {"id":"prod_881","codigo":"T-691","nome":"TELHA PAULISTINHA 3 POR 1M","categoria":"Telhas & Coberturas","especie":"Diversos","tipo_calculo":"UN","unidade_medida":"UN","preco_unitario":3.8,"taxa_plaina_padrao":0,"estoque_atual":850,"estoque_minimo":150,"ativo":true},
  {"id":"prod_882","codigo":"MAT-882","nome":"TELHA POLICARBONATO ROMANA E PORTUGUESA","categoria":"Telhas & Coberturas","especie":"Policarbonato","tipo_calculo":"UN","unidade_medida":"UN","preco_unitario":24,"taxa_plaina_padrao":0,"estoque_atual":850,"estoque_minimo":150,"ativo":true},
  {"id":"prod_883","codigo":"T-692","nome":"TELHA POLICARBONATO ROMANA E PORTUGUESA UNIVERSAL","categoria":"Telhas & Coberturas","especie":"Policarbonato","tipo_calculo":"UN","unidade_medida":"UN","preco_unitario":20.74,"taxa_plaina_padrao":0,"estoque_atual":850,"estoque_minimo":150,"ativo":true},
  {"id":"prod_884","codigo":"MAT-884","nome":"TELHA PP LEITOSA BR 244X110 ATCO","categoria":"Telhas & Coberturas","especie":"Diversos","tipo_calculo":"UN","unidade_medida":"UN","preco_unitario":142.5,"taxa_plaina_padrao":0,"estoque_atual":850,"estoque_minimo":150,"ativo":true},
  {"id":"prod_885","codigo":"MAT-885","nome":"TELHA TRANSLUCIDA FIBRA 244X110","categoria":"Telhas & Coberturas","especie":"Diversos","tipo_calculo":"UN","unidade_medida":"UN","preco_unitario":118.5,"taxa_plaina_padrao":0,"estoque_atual":850,"estoque_minimo":150,"ativo":true},
  {"id":"prod_886","codigo":"T-694","nome":"TELHA TRANSLÚCIDA TRANSPARENTE 244X110","categoria":"Telhas & Coberturas","especie":"Diversos","tipo_calculo":"UN","unidade_medida":"UN","preco_unitario":93,"taxa_plaina_padrao":0,"estoque_atual":850,"estoque_minimo":150,"ativo":true},
  {"id":"prod_887","codigo":"T-695","nome":"TEMPORIZADOR ANALÓGICO DE TOMADA BV.","categoria":"Elétrica & Iluminação","especie":"Cobre / Termoplástico","tipo_calculo":"UN","unidade_medida":"UN","preco_unitario":42,"taxa_plaina_padrao":0,"estoque_atual":55,"estoque_minimo":15,"ativo":true},
  {"id":"prod_888","codigo":"MAT-888","nome":"TESOURA DOMESTICA MULT 21 CM  NOX","categoria":"Ferramentas & Acessórios","especie":"Aço / Ferramental","tipo_calculo":"UN","unidade_medida":"UN","preco_unitario":11.8,"taxa_plaina_padrao":0,"estoque_atual":25,"estoque_minimo":5,"ativo":true},
  {"id":"prod_889","codigo":"MAT-889","nome":"TESTE DIGITAL THOMPSON 120/220V","categoria":"Utilidades Gerais","especie":"Diversos","tipo_calculo":"UN","unidade_medida":"UN","preco_unitario":9.3,"taxa_plaina_padrao":0,"estoque_atual":40,"estoque_minimo":10,"ativo":true},
  {"id":"prod_890","codigo":"MAT-890","nome":"THINNER ITAGUA 900ML","categoria":"Tintas & Química","especie":"Químico","tipo_calculo":"UN","unidade_medida":"UN","preco_unitario":18.9,"taxa_plaina_padrao":0,"estoque_atual":35,"estoque_minimo":10,"ativo":true},
  {"id":"prod_891","codigo":"MAT-891","nome":"THINNER NATRIELLI 5 LITROS","categoria":"Tintas & Química","especie":"Químico","tipo_calculo":"UN","unidade_medida":"UN","preco_unitario":127.4,"taxa_plaina_padrao":0,"estoque_atual":35,"estoque_minimo":10,"ativo":true},
  {"id":"prod_892","codigo":"MAT-892","nome":"THINNER NATRIELLI 900ML","categoria":"Tintas & Química","especie":"Químico","tipo_calculo":"UN","unidade_medida":"UN","preco_unitario":25.4,"taxa_plaina_padrao":0,"estoque_atual":35,"estoque_minimo":10,"ativo":true},
  {"id":"prod_893","codigo":"MAT-893","nome":"THINNER SM 100 900 ML LIMPEZA MULTIUSO MAZA","categoria":"Tintas & Química","especie":"Químico","tipo_calculo":"UN","unidade_medida":"UN","preco_unitario":19.5,"taxa_plaina_padrao":0,"estoque_atual":35,"estoque_minimo":10,"ativo":true},
  {"id":"prod_894","codigo":"T-703","nome":"TIJOLO BAIANO 11,5X19X29 - MILHEIRO R$1.840,00 X PAL. 360","categoria":"Construção & Alvenaria","especie":"Cerâmica","tipo_calculo":"UN","unidade_medida":"UN","preco_unitario":2,"taxa_plaina_padrao":0,"estoque_atual":1500,"estoque_minimo":300,"ativo":true},
  {"id":"prod_895","codigo":"T-704","nome":"TIJOLO BAIANO 14X19X29 - MILHEIRO R$2.020,00 X PAL.","categoria":"Construção & Alvenaria","especie":"Cerâmica","tipo_calculo":"UN","unidade_medida":"UN","preco_unitario":2.2,"taxa_plaina_padrao":0,"estoque_atual":1500,"estoque_minimo":300,"ativo":true},
  {"id":"prod_896","codigo":"MAT-896","nome":"TIJOLO BAIANO 9X19X29 - MILHEIRO R$1.600,00 X PAL.","categoria":"Construção & Alvenaria","especie":"Cerâmica","tipo_calculo":"UN","unidade_medida":"UN","preco_unitario":1.8,"taxa_plaina_padrao":0,"estoque_atual":1500,"estoque_minimo":300,"ativo":true},
  {"id":"prod_897","codigo":"MAT-897","nome":"TIJOLO VAZADO 26X18","categoria":"Construção & Alvenaria","especie":"Cerâmica","tipo_calculo":"UN","unidade_medida":"UN","preco_unitario":9,"taxa_plaina_padrao":0,"estoque_atual":1500,"estoque_minimo":300,"ativo":true},
  {"id":"prod_898","codigo":"MAT-898","nome":"TIJOLOS BAIANO 11,5X19X29","categoria":"Construção & Alvenaria","especie":"Cerâmica","tipo_calculo":"UN","unidade_medida":"UN","preco_unitario":1561.8,"taxa_plaina_padrao":0,"estoque_atual":1500,"estoque_minimo":300,"ativo":true},
  {"id":"prod_899","codigo":"MAT-899","nome":"TIJOLOS BAIANO 14X19X29","categoria":"Construção & Alvenaria","especie":"Cerâmica","tipo_calculo":"UN","unidade_medida":"UN","preco_unitario":1712.5,"taxa_plaina_padrao":0,"estoque_atual":1500,"estoque_minimo":300,"ativo":true},
  {"id":"prod_900","codigo":"MAT-900","nome":"TIJOLOS BAIANO 9X19X29","categoria":"Construção & Alvenaria","especie":"Cerâmica","tipo_calculo":"UN","unidade_medida":"UN","preco_unitario":1398,"taxa_plaina_padrao":0,"estoque_atual":1500,"estoque_minimo":300,"ativo":true},
  {"id":"prod_901","codigo":"MAT-901","nome":"TINTA ACR STANDARD INTERNA E EXTERNA 15 L BRANCO NEVE","categoria":"Tintas & Química","especie":"Químico","tipo_calculo":"UN","unidade_medida":"UN","preco_unitario":314.5,"taxa_plaina_padrao":0,"estoque_atual":35,"estoque_minimo":10,"ativo":true},
  {"id":"prod_902","codigo":"MAT-902","nome":"TINTA ACR ULTRA 3,6 L MAZA ( BRANCA , AMARELA)","categoria":"Tintas & Química","especie":"Químico","tipo_calculo":"UN","unidade_medida":"UN","preco_unitario":90,"taxa_plaina_padrao":0,"estoque_atual":35,"estoque_minimo":10,"ativo":true},
  {"id":"prod_903","codigo":"MAT-903","nome":"TINTA ACR ULTRA BRANCO 18L MAZA","categoria":"Tintas & Química","especie":"Químico","tipo_calculo":"UN","unidade_medida":"UN","preco_unitario":346.9,"taxa_plaina_padrao":0,"estoque_atual":35,"estoque_minimo":10,"ativo":true},
  {"id":"prod_904","codigo":"MAT-904","nome":"TINTA PISO PREMIUM 18 L MAZA","categoria":"Tintas & Química","especie":"Químico","tipo_calculo":"UN","unidade_medida":"UN","preco_unitario":340,"taxa_plaina_padrao":0,"estoque_atual":35,"estoque_minimo":10,"ativo":true},
  {"id":"prod_905","codigo":"T-710","nome":"TINTA SPRAY 400ML MUNDIAL CORES","categoria":"Tintas & Química","especie":"Químico","tipo_calculo":"UN","unidade_medida":"UN","preco_unitario":18.4,"taxa_plaina_padrao":0,"estoque_atual":35,"estoque_minimo":10,"ativo":true},
  {"id":"prod_906","codigo":"MAT-906","nome":"TINTAS MOCOCA EXTERMINADOR DE CUPINS 900 ML","categoria":"Tintas & Química","especie":"Químico","tipo_calculo":"UN","unidade_medida":"UN","preco_unitario":28.5,"taxa_plaina_padrao":0,"estoque_atual":35,"estoque_minimo":10,"ativo":true},
  {"id":"prod_907","codigo":"MAT-907","nome":"TINTAS SOFT MEGAÓ ACRILICA CONT 15 L COR INTERNO","categoria":"Tintas & Química","especie":"Químico","tipo_calculo":"UN","unidade_medida":"UN","preco_unitario":190.4,"taxa_plaina_padrao":0,"estoque_atual":35,"estoque_minimo":10,"ativo":true},
  {"id":"prod_908","codigo":"MAT-908","nome":"TINTAS SOFT MEGAÓ ACRILICA CONT 3,6 L VARIAS COR INTERNO","categoria":"Tintas & Química","especie":"Químico","tipo_calculo":"UN","unidade_medida":"UN","preco_unitario":59.5,"taxa_plaina_padrao":0,"estoque_atual":35,"estoque_minimo":10,"ativo":true},
  {"id":"prod_909","codigo":"T-714","nome":"TOMADA SOBR. RETANGULAR 10A ILUMI","categoria":"Elétrica & Iluminação","especie":"Cobre / Termoplástico","tipo_calculo":"UN","unidade_medida":"UN","preco_unitario":6,"taxa_plaina_padrao":0,"estoque_atual":55,"estoque_minimo":15,"ativo":true},
  {"id":"prod_910","codigo":"T-715","nome":"TOMADA SOBR. RETANGULAR 20A ILUMI","categoria":"Elétrica & Iluminação","especie":"Cobre / Termoplástico","tipo_calculo":"UN","unidade_medida":"UN","preco_unitario":6.9,"taxa_plaina_padrao":0,"estoque_atual":55,"estoque_minimo":15,"ativo":true},
  {"id":"prod_911","codigo":"T-716","nome":"TORNEIRA BICA MOVEL DE MESA C/AREJADOR CROMADO","categoria":"Hidráulica & Conexões","especie":"PVC / Metal","tipo_calculo":"UN","unidade_medida":"UN","preco_unitario":32,"taxa_plaina_padrao":0,"estoque_atual":70,"estoque_minimo":20,"ativo":true},
  {"id":"prod_912","codigo":"T-717","nome":"TORNEIRA BICA MOVEL PARADE C/FILTRO","categoria":"Hidráulica & Conexões","especie":"PVC / Metal","tipo_calculo":"UN","unidade_medida":"UN","preco_unitario":165,"taxa_plaina_padrao":0,"estoque_atual":70,"estoque_minimo":20,"ativo":true},
  {"id":"prod_913","codigo":"T-718","nome":"TORNEIRA BRANCA MESA ARTPLAS","categoria":"Hidráulica & Conexões","especie":"PVC / Metal","tipo_calculo":"UN","unidade_medida":"UN","preco_unitario":32,"taxa_plaina_padrao":0,"estoque_atual":70,"estoque_minimo":20,"ativo":true},
  {"id":"prod_914","codigo":"T-719","nome":"TORNEIRA COLOR SLIM PAREDE VERMELHA 1/4 VOLTA","categoria":"Hidráulica & Conexões","especie":"PVC / Metal","tipo_calculo":"UN","unidade_medida":"UN","preco_unitario":147,"taxa_plaina_padrao":0,"estoque_atual":70,"estoque_minimo":20,"ativo":true},
  {"id":"prod_915","codigo":"T-720","nome":"TORNEIRA DE JARDIM ARTPLAS","categoria":"Hidráulica & Conexões","especie":"PVC / Metal","tipo_calculo":"UN","unidade_medida":"UN","preco_unitario":24,"taxa_plaina_padrao":0,"estoque_atual":70,"estoque_minimo":20,"ativo":true},
  {"id":"prod_916","codigo":"T-721","nome":"TORNEIRA DE MESA CROMADO ARTPLAS","categoria":"Hidráulica & Conexões","especie":"PVC / Metal","tipo_calculo":"UN","unidade_medida":"UN","preco_unitario":32,"taxa_plaina_padrao":0,"estoque_atual":70,"estoque_minimo":20,"ativo":true},
  {"id":"prod_917","codigo":"T-722","nome":"TORNEIRA GORME CONE DE MESA C/FILTRO CABINHO CROMADO KIT METAIS","categoria":"Hidráulica & Conexões","especie":"PVC / Metal","tipo_calculo":"UN","unidade_medida":"UN","preco_unitario":201,"taxa_plaina_padrao":0,"estoque_atual":70,"estoque_minimo":20,"ativo":true},
  {"id":"prod_918","codigo":"T-723","nome":"TORNEIRA GORME CONE PAREDE C/FILTRO CABINHO CROMADO KIT METAIS","categoria":"Hidráulica & Conexões","especie":"PVC / Metal","tipo_calculo":"UN","unidade_medida":"UN","preco_unitario":187,"taxa_plaina_padrao":0,"estoque_atual":70,"estoque_minimo":20,"ativo":true},
  {"id":"prod_919","codigo":"T-724","nome":"TORNEIRA JARDIM CURTA 1/2 X 3/4 CROMADA METAL / AMARELA","categoria":"Hidráulica & Conexões","especie":"PVC / Metal","tipo_calculo":"UN","unidade_medida":"UN","preco_unitario":36,"taxa_plaina_padrao":0,"estoque_atual":70,"estoque_minimo":20,"ativo":true},
  {"id":"prod_920","codigo":"T-725","nome":"TORNEIRA JARDIM LONGA 1/2 X 3/4 CROMADA METAL / AMARELA","categoria":"Hidráulica & Conexões","especie":"PVC / Metal","tipo_calculo":"UN","unidade_medida":"UN","preco_unitario":42,"taxa_plaina_padrao":0,"estoque_atual":70,"estoque_minimo":20,"ativo":true},
  {"id":"prod_921","codigo":"T-726","nome":"TORNEIRA JARDIM POP ALUMINIO 1/2 X 3/4 FORUSI","categoria":"Hidráulica & Conexões","especie":"Alumínio","tipo_calculo":"UN","unidade_medida":"UN","preco_unitario":28.4,"taxa_plaina_padrao":0,"estoque_atual":70,"estoque_minimo":20,"ativo":true},
  {"id":"prod_922","codigo":"T-727","nome":"TORNEIRA LAVATORIO LUXO 1195 C-34 1/4 DE VOLTA KIT METAIS","categoria":"Hidráulica & Conexões","especie":"PVC / Metal","tipo_calculo":"UN","unidade_medida":"UN","preco_unitario":75,"taxa_plaina_padrao":0,"estoque_atual":70,"estoque_minimo":20,"ativo":true},
  {"id":"prod_923","codigo":"T-728","nome":"TORNEIRA LAVATORIO SIMPLES C-33 PAREDE JR KIT METAIS","categoria":"Hidráulica & Conexões","especie":"PVC / Metal","tipo_calculo":"UN","unidade_medida":"UN","preco_unitario":43.5,"taxa_plaina_padrao":0,"estoque_atual":70,"estoque_minimo":20,"ativo":true},
  {"id":"prod_924","codigo":"T-729","nome":"TORNEIRA P/MAQUINA DE LAVAR CROMADO ARTPLAS","categoria":"Hidráulica & Conexões","especie":"PVC / Metal","tipo_calculo":"UN","unidade_medida":"UN","preco_unitario":32,"taxa_plaina_padrao":0,"estoque_atual":70,"estoque_minimo":20,"ativo":true},
  {"id":"prod_925","codigo":"T-730","nome":"TORNEIRA PIA BICA MOVEL PAREDE C-33 X C-50 KIT METAIS","categoria":"Hidráulica & Conexões","especie":"PVC / Metal","tipo_calculo":"UN","unidade_medida":"UN","preco_unitario":72,"taxa_plaina_padrao":0,"estoque_atual":70,"estoque_minimo":20,"ativo":true},
  {"id":"prod_926","codigo":"T-731","nome":"TORNEIRA PIA BICA MOVEL PAREDE C-34 1/4 DE VOLTA KIT METAIS","categoria":"Hidráulica & Conexões","especie":"PVC / Metal","tipo_calculo":"UN","unidade_medida":"UN","preco_unitario":76.8,"taxa_plaina_padrao":0,"estoque_atual":70,"estoque_minimo":20,"ativo":true},
  {"id":"prod_927","codigo":"T-732","nome":"TORNEIRA PIA C/ AREJADOR CR 1158 /1159 C-33 KIT METAIS","categoria":"Hidráulica & Conexões","especie":"PVC / Metal","tipo_calculo":"UN","unidade_medida":"UN","preco_unitario":60,"taxa_plaina_padrao":0,"estoque_atual":70,"estoque_minimo":20,"ativo":true},
  {"id":"prod_928","codigo":"T-733","nome":"TORNEIRA PIA PAREDE CROMADA ARTPLAS","categoria":"Hidráulica & Conexões","especie":"PVC / Metal","tipo_calculo":"UN","unidade_medida":"UN","preco_unitario":32,"taxa_plaina_padrao":0,"estoque_atual":70,"estoque_minimo":20,"ativo":true},
  {"id":"prod_929","codigo":"T-734","nome":"TORNEIRA TANQUE E MAQUINA DE LAVAR 1/2 X 3/4 KIT METAIS 1131","categoria":"Hidráulica & Conexões","especie":"PVC / Metal","tipo_calculo":"UN","unidade_medida":"UN","preco_unitario":85.5,"taxa_plaina_padrao":0,"estoque_atual":70,"estoque_minimo":20,"ativo":true},
  {"id":"prod_930","codigo":"T-735","nome":"TORQUES ARMADOR 10- FUZIL","categoria":"Ferramentas & Acessórios","especie":"Aço / Ferramental","tipo_calculo":"UN","unidade_medida":"UN","preco_unitario":45.8,"taxa_plaina_padrao":0,"estoque_atual":25,"estoque_minimo":5,"ativo":true},
  {"id":"prod_931","codigo":"T-736","nome":"TORQUES ARMADOR 14- FUZIL","categoria":"Ferramentas & Acessórios","especie":"Aço / Ferramental","tipo_calculo":"UN","unidade_medida":"UN","preco_unitario":63.8,"taxa_plaina_padrao":0,"estoque_atual":25,"estoque_minimo":5,"ativo":true},
  {"id":"prod_932","codigo":"T-737","nome":"TORQUES AZULEJISTA AÇO 06","categoria":"Ferramentas & Acessórios","especie":"Aço","tipo_calculo":"UN","unidade_medida":"UN","preco_unitario":16.5,"taxa_plaina_padrao":0,"estoque_atual":25,"estoque_minimo":5,"ativo":true},
  {"id":"prod_933","codigo":"T-738","nome":"TORQUES AZULEJISTA AÇO 12","categoria":"Ferramentas & Acessórios","especie":"Aço","tipo_calculo":"UN","unidade_medida":"UN","preco_unitario":51.4,"taxa_plaina_padrao":0,"estoque_atual":25,"estoque_minimo":5,"ativo":true},
  {"id":"prod_934","codigo":"T-739","nome":"TRANCA DE TONI N°2 -628","categoria":"Ferragens & Cercas","especie":"Aço Galvanizado","tipo_calculo":"UN","unidade_medida":"UN","preco_unitario":12.9,"taxa_plaina_padrao":0,"estoque_atual":45,"estoque_minimo":10,"ativo":true},
  {"id":"prod_935","codigo":"T-740","nome":"TRANCA DE TONI N°3 -629","categoria":"Ferragens & Cercas","especie":"Aço Galvanizado","tipo_calculo":"UN","unidade_medida":"UN","preco_unitario":14.55,"taxa_plaina_padrao":0,"estoque_atual":45,"estoque_minimo":10,"ativo":true},
  {"id":"prod_936","codigo":"T-741","nome":"TRANCA DE TONI Nº4 -630","categoria":"Ferragens & Cercas","especie":"Aço Galvanizado","tipo_calculo":"UN","unidade_medida":"UN","preco_unitario":17.55,"taxa_plaina_padrao":0,"estoque_atual":45,"estoque_minimo":10,"ativo":true},
  {"id":"prod_937","codigo":"T-642","nome":"TRANCA P/ PORTEIRA COMP. 30 CM","categoria":"Ferragens & Cercas","especie":"Aço Galvanizado","tipo_calculo":"UN","unidade_medida":"UN","preco_unitario":45,"taxa_plaina_padrao":0,"estoque_atual":45,"estoque_minimo":10,"ativo":true},
  {"id":"prod_938","codigo":"T-643","nome":"TRANCA P/ PORTÃO 100X52 MM","categoria":"Ferragens & Cercas","especie":"Aço Galvanizado","tipo_calculo":"UN","unidade_medida":"UN","preco_unitario":12.9,"taxa_plaina_padrao":0,"estoque_atual":45,"estoque_minimo":10,"ativo":true},
  {"id":"prod_939","codigo":"T-645","nome":"TRANCA P/ PORTÃO 150X52 MM","categoria":"Ferragens & Cercas","especie":"Aço Galvanizado","tipo_calculo":"UN","unidade_medida":"UN","preco_unitario":17.7,"taxa_plaina_padrao":0,"estoque_atual":45,"estoque_minimo":10,"ativo":true},
  {"id":"prod_940","codigo":"T-644","nome":"TRANCA P/ PORTÕA 120X52 MM","categoria":"Ferragens & Cercas","especie":"Aço Galvanizado","tipo_calculo":"UN","unidade_medida":"UN","preco_unitario":14.7,"taxa_plaina_padrao":0,"estoque_atual":45,"estoque_minimo":10,"ativo":true},
  {"id":"prod_941","codigo":"T-742","nome":"TRENA GCORTE 3 MT","categoria":"Ferramentas & Acessórios","especie":"Aço / Ferramental","tipo_calculo":"UN","unidade_medida":"UN","preco_unitario":14.85,"taxa_plaina_padrao":0,"estoque_atual":25,"estoque_minimo":5,"ativo":true},
  {"id":"prod_942","codigo":"T-743","nome":"TRENA GCORTE 5 MT","categoria":"Ferramentas & Acessórios","especie":"Aço / Ferramental","tipo_calculo":"UN","unidade_medida":"UN","preco_unitario":17.25,"taxa_plaina_padrao":0,"estoque_atual":25,"estoque_minimo":5,"ativo":true},
  {"id":"prod_943","codigo":"T-744","nome":"TRENA GCORTE 7,5 MT","categoria":"Ferramentas & Acessórios","especie":"Aço / Ferramental","tipo_calculo":"UN","unidade_medida":"UN","preco_unitario":28.35,"taxa_plaina_padrao":0,"estoque_atual":25,"estoque_minimo":5,"ativo":true},
  {"id":"prod_944","codigo":"T-745","nome":"TRENA LONGA 20 M FITA PVC","categoria":"Ferramentas & Acessórios","especie":"PVC","tipo_calculo":"UN","unidade_medida":"UN","preco_unitario":32.7,"taxa_plaina_padrao":0,"estoque_atual":25,"estoque_minimo":5,"ativo":true},
  {"id":"prod_945","codigo":"T-746","nome":"TRENA LONGA 30 M FITA PVC","categoria":"Ferramentas & Acessórios","especie":"PVC","tipo_calculo":"UN","unidade_medida":"UN","preco_unitario":40.2,"taxa_plaina_padrao":0,"estoque_atual":25,"estoque_minimo":5,"ativo":true},
  {"id":"prod_946","codigo":"T-747","nome":"TRENA LONGA 50 M FITA PVC","categoria":"Ferramentas & Acessórios","especie":"PVC","tipo_calculo":"UN","unidade_medida":"UN","preco_unitario":83.7,"taxa_plaina_padrao":0,"estoque_atual":25,"estoque_minimo":5,"ativo":true},
  {"id":"prod_947","codigo":"T-748","nome":"TRINCO SILVANA Nº2 -676","categoria":"Ferragens & Cercas","especie":"Aço Galvanizado","tipo_calculo":"UN","unidade_medida":"UN","preco_unitario":9.3,"taxa_plaina_padrao":0,"estoque_atual":45,"estoque_minimo":10,"ativo":true},
  {"id":"prod_948","codigo":"T-749","nome":"TRINCO SILVANA Nº3 -677","categoria":"Ferragens & Cercas","especie":"Aço Galvanizado","tipo_calculo":"UN","unidade_medida":"UN","preco_unitario":10.8,"taxa_plaina_padrao":0,"estoque_atual":45,"estoque_minimo":10,"ativo":true},
  {"id":"prod_949","codigo":"T-750","nome":"TRINCO SILVANA Nº4 -678","categoria":"Ferragens & Cercas","especie":"Aço Galvanizado","tipo_calculo":"UN","unidade_medida":"UN","preco_unitario":12,"taxa_plaina_padrao":0,"estoque_atual":45,"estoque_minimo":10,"ativo":true},
  {"id":"prod_950","codigo":"MAT-950","nome":"TUBO PVC ESG 100 MM X 6 M PLASTUBOS","categoria":"Hidráulica & Conexões","especie":"PVC","tipo_calculo":"UN","unidade_medida":"UN","preco_unitario":74.4,"taxa_plaina_padrao":0,"estoque_atual":70,"estoque_minimo":20,"ativo":true},
  {"id":"prod_951","codigo":"MAT-951","nome":"TUBO PVC ESG 40 MM X 6 M PLASTUBOS","categoria":"Hidráulica & Conexões","especie":"PVC","tipo_calculo":"UN","unidade_medida":"UN","preco_unitario":35.4,"taxa_plaina_padrao":0,"estoque_atual":70,"estoque_minimo":20,"ativo":true},
  {"id":"prod_952","codigo":"MAT-952","nome":"TUBO PVC ESG 50 MM X 6 M PLASTUBOS","categoria":"Hidráulica & Conexões","especie":"PVC","tipo_calculo":"UN","unidade_medida":"UN","preco_unitario":59.5,"taxa_plaina_padrao":0,"estoque_atual":70,"estoque_minimo":20,"ativo":true},
  {"id":"prod_953","codigo":"MAT-953","nome":"TUBO PVC ESG 75 MM X 6 M PLASTUBOS","categoria":"Hidráulica & Conexões","especie":"PVC","tipo_calculo":"UN","unidade_medida":"UN","preco_unitario":87,"taxa_plaina_padrao":0,"estoque_atual":70,"estoque_minimo":20,"ativo":true},
  {"id":"prod_954","codigo":"MAT-954","nome":"TUBO PVC SOLD 20 MM X6 M PLASTUBOS","categoria":"Hidráulica & Conexões","especie":"PVC","tipo_calculo":"UN","unidade_medida":"UN","preco_unitario":25,"taxa_plaina_padrao":0,"estoque_atual":70,"estoque_minimo":20,"ativo":true},
  {"id":"prod_955","codigo":"MAT-955","nome":"TUBO PVC SOLD 25 MM 6 M PLASTUBOS","categoria":"Hidráulica & Conexões","especie":"PVC","tipo_calculo":"UN","unidade_medida":"UN","preco_unitario":21,"taxa_plaina_padrao":0,"estoque_atual":70,"estoque_minimo":20,"ativo":true},
  {"id":"prod_956","codigo":"MAT-956","nome":"TUBO PVC SOLD 50 MM X 6 M PLASTUBOS","categoria":"Hidráulica & Conexões","especie":"PVC","tipo_calculo":"UN","unidade_medida":"UN","preco_unitario":80.4,"taxa_plaina_padrao":0,"estoque_atual":70,"estoque_minimo":20,"ativo":true},
  {"id":"prod_957","codigo":"U-758","nome":"UNIÃO 3/4 INTERNA PRETO PÇ","categoria":"Hidráulica & Conexões","especie":"PVC / Metal","tipo_calculo":"UN","unidade_medida":"UN","preco_unitario":1,"taxa_plaina_padrao":0,"estoque_atual":70,"estoque_minimo":20,"ativo":true},
  {"id":"prod_958","codigo":"U-759","nome":"UNIÃO SOLD 25MM PLASTUBOS","categoria":"Hidráulica & Conexões","especie":"PVC / Metal","tipo_calculo":"UN","unidade_medida":"UN","preco_unitario":7.8,"taxa_plaina_padrao":0,"estoque_atual":70,"estoque_minimo":20,"ativo":true},
  {"id":"prod_959","codigo":"U-760","nome":"UNIÃO SOLD 50MM PLASTUBOS","categoria":"Hidráulica & Conexões","especie":"PVC / Metal","tipo_calculo":"UN","unidade_medida":"UN","preco_unitario":34.8,"taxa_plaina_padrao":0,"estoque_atual":70,"estoque_minimo":20,"ativo":true},
  {"id":"prod_960","codigo":"V-761","nome":"VALVULA  TAMQUE METAL","categoria":"Hidráulica & Conexões","especie":"PVC / Metal","tipo_calculo":"UN","unidade_medida":"UN","preco_unitario":30,"taxa_plaina_padrao":0,"estoque_atual":70,"estoque_minimo":20,"ativo":true},
  {"id":"prod_961","codigo":"V-762","nome":"VALVULA AMERICANA PIA METAL","categoria":"Hidráulica & Conexões","especie":"PVC / Metal","tipo_calculo":"UN","unidade_medida":"UN","preco_unitario":30,"taxa_plaina_padrao":0,"estoque_atual":70,"estoque_minimo":20,"ativo":true},
  {"id":"prod_962","codigo":"V-763","nome":"VALVULA LAVATORIO METAL","categoria":"Hidráulica & Conexões","especie":"PVC / Metal","tipo_calculo":"UN","unidade_medida":"UN","preco_unitario":23.4,"taxa_plaina_padrao":0,"estoque_atual":70,"estoque_minimo":20,"ativo":true},
  {"id":"prod_963","codigo":"V-764","nome":"VALVULA P/ PIA AMERICANA INOX 4 1/2 PADORA","categoria":"Hidráulica & Conexões","especie":"PVC / Metal","tipo_calculo":"UN","unidade_medida":"UN","preco_unitario":27,"taxa_plaina_padrao":0,"estoque_atual":70,"estoque_minimo":20,"ativo":true},
  {"id":"prod_964","codigo":"V-765","nome":"VARAL DE AÇO REVEST PVC 10 M VITORIA","categoria":"EPIs, Cordas & Diversos","especie":"PVC","tipo_calculo":"UN","unidade_medida":"UN","preco_unitario":3.2,"taxa_plaina_padrao":0,"estoque_atual":40,"estoque_minimo":10,"ativo":true},
  {"id":"prod_965","codigo":"V-766","nome":"VARAL DE AÇO REVEST PVC 15 M VITORIA","categoria":"EPIs, Cordas & Diversos","especie":"PVC","tipo_calculo":"UN","unidade_medida":"UN","preco_unitario":4.8,"taxa_plaina_padrao":0,"estoque_atual":40,"estoque_minimo":10,"ativo":true},
  {"id":"prod_966","codigo":"MAT-966","nome":"VARAL DE AÇO REVEST PVC 20 CM VITORIA","categoria":"EPIs, Cordas & Diversos","especie":"PVC","tipo_calculo":"UN","unidade_medida":"UN","preco_unitario":4.5,"taxa_plaina_padrao":0,"estoque_atual":40,"estoque_minimo":10,"ativo":true},
  {"id":"prod_967","codigo":"V-767","nome":"VARAL DE AÇO REVEST PVC 20 M VITORIA","categoria":"EPIs, Cordas & Diversos","especie":"PVC","tipo_calculo":"UN","unidade_medida":"UN","preco_unitario":6,"taxa_plaina_padrao":0,"estoque_atual":40,"estoque_minimo":10,"ativo":true},
  {"id":"prod_968","codigo":"V-768","nome":"VASO SANITARIO BRANCO COLONILAL HERVY","categoria":"Construção & Alvenaria","especie":"Diversos","tipo_calculo":"UN","unidade_medida":"UN","preco_unitario":288,"taxa_plaina_padrao":0,"estoque_atual":8,"estoque_minimo":2,"ativo":true},
  {"id":"prod_969","codigo":"MAT-969","nome":"VASO SANITARIO CONVENCIONAL BRANCO COLONILAL HERVY","categoria":"Construção & Alvenaria","especie":"Diversos","tipo_calculo":"UN","unidade_medida":"UN","preco_unitario":230,"taxa_plaina_padrao":0,"estoque_atual":8,"estoque_minimo":2,"ativo":true},
  {"id":"prod_970","codigo":"V-769","nome":"VASO SANITARIO P/ CX ACOP. OVAL BRANCO  ARAXA STA CLARA","categoria":"Construção & Alvenaria","especie":"Aço","tipo_calculo":"UN","unidade_medida":"UN","preco_unitario":318,"taxa_plaina_padrao":0,"estoque_atual":8,"estoque_minimo":2,"ativo":true},
  {"id":"prod_971","codigo":"V-770","nome":"VASSOURA GARI C/ CABO GRANDE","categoria":"EPIs, Cordas & Diversos","especie":"Diversos","tipo_calculo":"UN","unidade_medida":"UN","preco_unitario":46.8,"taxa_plaina_padrao":0,"estoque_atual":40,"estoque_minimo":10,"ativo":true},
  {"id":"prod_972","codigo":"MAT-972","nome":"VASSOURA RUBI C/ CABO PEQUENA","categoria":"EPIs, Cordas & Diversos","especie":"Diversos","tipo_calculo":"UN","unidade_medida":"UN","preco_unitario":14.2,"taxa_plaina_padrao":0,"estoque_atual":40,"estoque_minimo":10,"ativo":true},
  {"id":"prod_973","codigo":"MAT-973","nome":"VEDA CALHA TEK BOND 285G","categoria":"Tintas & Química","especie":"Químico","tipo_calculo":"UN","unidade_medida":"UN","preco_unitario":22,"taxa_plaina_padrao":0,"estoque_atual":35,"estoque_minimo":10,"ativo":true},
  {"id":"prod_974","codigo":"V-773","nome":"VEDA ROSCA 12MM X 5M","categoria":"Hidráulica & Conexões","especie":"PVC / Metal","tipo_calculo":"UN","unidade_medida":"UN","preco_unitario":2.2,"taxa_plaina_padrao":0,"estoque_atual":70,"estoque_minimo":20,"ativo":true},
  {"id":"prod_975","codigo":"V-774","nome":"VEDA ROSCA 18MM X 10M","categoria":"Hidráulica & Conexões","especie":"PVC / Metal","tipo_calculo":"UN","unidade_medida":"UN","preco_unitario":2.4,"taxa_plaina_padrao":0,"estoque_atual":70,"estoque_minimo":20,"ativo":true},
  {"id":"prod_976","codigo":"V-775","nome":"VEDA ROSCA 18MM X 25M","categoria":"Hidráulica & Conexões","especie":"PVC / Metal","tipo_calculo":"UN","unidade_medida":"UN","preco_unitario":6.2,"taxa_plaina_padrao":0,"estoque_atual":70,"estoque_minimo":20,"ativo":true},
  {"id":"prod_977","codigo":"V-776","nome":"VELA REFIL CERAMICA  CARVÃO ATIVADO","categoria":"Hidráulica & Conexões","especie":"Cerâmica","tipo_calculo":"UN","unidade_medida":"UN","preco_unitario":9,"taxa_plaina_padrao":0,"estoque_atual":70,"estoque_minimo":20,"ativo":true},
  {"id":"prod_978","codigo":"V-778","nome":"VERNIZ AYERLACK 3,6 L","categoria":"Tintas & Química","especie":"Químico","tipo_calculo":"UN","unidade_medida":"UN","preco_unitario":162,"taxa_plaina_padrao":0,"estoque_atual":35,"estoque_minimo":10,"ativo":true},
  {"id":"prod_979","codigo":"MAT-979","nome":"VERNIZ MARIT PREMIUM BRILHO IMBUIA 3,6 L MOCOCA","categoria":"Tintas & Química","especie":"Químico","tipo_calculo":"UN","unidade_medida":"UN","preco_unitario":137.4,"taxa_plaina_padrao":0,"estoque_atual":35,"estoque_minimo":10,"ativo":true},
  {"id":"prod_980","codigo":"MAT-980","nome":"VERNIZ MARIT PREMIUM BRILHO IMBUIA 900ML","categoria":"Tintas & Química","especie":"Químico","tipo_calculo":"UN","unidade_medida":"UN","preco_unitario":38.4,"taxa_plaina_padrao":0,"estoque_atual":35,"estoque_minimo":10,"ativo":true},
  {"id":"prod_981","codigo":"MAT-981","nome":"VERNIZ SAYERLACK 225 ML","categoria":"Tintas & Química","especie":"Químico","tipo_calculo":"UN","unidade_medida":"UN","preco_unitario":22.2,"taxa_plaina_padrao":0,"estoque_atual":35,"estoque_minimo":10,"ativo":true},
  {"id":"prod_982","codigo":"V-779","nome":"VERNIZ SAYERLACK 900 ML","categoria":"Tintas & Química","especie":"Químico","tipo_calculo":"UN","unidade_medida":"UN","preco_unitario":51,"taxa_plaina_padrao":0,"estoque_atual":35,"estoque_minimo":10,"ativo":true},
  {"id":"prod_983","codigo":"MAT-983","nome":"VERNIZ SINT COPAL PREMIUM BRILHO INCOLOR 3,6 L MOCOCA","categoria":"Tintas & Química","especie":"Químico","tipo_calculo":"UN","unidade_medida":"UN","preco_unitario":127.5,"taxa_plaina_padrao":0,"estoque_atual":35,"estoque_minimo":10,"ativo":true},
  {"id":"prod_984","codigo":"MAT-984","nome":"VERNIZ SINT COPAL PREMIUM BRILHO INCOLOR 900 ML","categoria":"Tintas & Química","especie":"Químico","tipo_calculo":"UN","unidade_medida":"UN","preco_unitario":38.4,"taxa_plaina_padrao":0,"estoque_atual":35,"estoque_minimo":10,"ativo":true},
  {"id":"prod_985","codigo":"MAT-985","nome":"VERNIZ SINT COPAL PREMIUM INCOLOR 225 ML","categoria":"Tintas & Química","especie":"Químico","tipo_calculo":"UN","unidade_medida":"UN","preco_unitario":22.5,"taxa_plaina_padrao":0,"estoque_atual":35,"estoque_minimo":10,"ativo":true},
  {"id":"prod_986","codigo":"MAT-986","nome":"VIGA EUCALIPTO 5X11","categoria":"Madeiras & Esquadrias","especie":"Eucalipto","tipo_calculo":"ML","unidade_medida":"ML","preco_unitario":13.2,"taxa_plaina_padrao":3.5,"estoque_atual":60,"estoque_minimo":20,"ativo":true,"comprimentos_comuns":[2.5,3,3.5,4]},
  {"id":"prod_987","codigo":"1-792","nome":"VIGA EUCALIPTO 5X15","categoria":"Madeiras & Esquadrias","especie":"Eucalipto","tipo_calculo":"ML","unidade_medida":"ML","preco_unitario":18,"taxa_plaina_padrao":3.5,"estoque_atual":60,"estoque_minimo":20,"ativo":true,"comprimentos_comuns":[2.5,3,3.5,4]},
  {"id":"prod_988","codigo":"1-793","nome":"VIGA EUCALIPTO 5X20","categoria":"Madeiras & Esquadrias","especie":"Eucalipto","tipo_calculo":"ML","unidade_medida":"ML","preco_unitario":25.5,"taxa_plaina_padrao":3.5,"estoque_atual":60,"estoque_minimo":20,"ativo":true,"comprimentos_comuns":[2.5,3,3.5,4]},
  {"id":"prod_989","codigo":"V-781","nome":"VITRO BASCULANTE  L 16 ALUM. BRANCO 60X60","categoria":"Construção & Alvenaria","especie":"Diversos","tipo_calculo":"UN","unidade_medida":"UN","preco_unitario":165,"taxa_plaina_padrao":0,"estoque_atual":8,"estoque_minimo":2,"ativo":true},
  {"id":"prod_990","codigo":"MAT-990","nome":"ÓCULOS DE PROTEÇÃO MINOTAURO FUME","categoria":"EPIs, Cordas & Diversos","especie":"Diversos","tipo_calculo":"UN","unidade_medida":"UN","preco_unitario":9,"taxa_plaina_padrao":0,"estoque_atual":40,"estoque_minimo":10,"ativo":true},
  {"id":"prod_991","codigo":"1-451","nome":"ÓCULOS PROTEÇÃO TRANSP. E FUME","categoria":"EPIs, Cordas & Diversos","especie":"Diversos","tipo_calculo":"UN","unidade_medida":"UN","preco_unitario":6.6,"taxa_plaina_padrao":0,"estoque_atual":40,"estoque_minimo":10,"ativo":true}
];

const SEED_CLIENTES = [
  {
    id: 'cli_1',
    nome: 'Construtora Alvorada Ltda (Eng. Roberto)',
    documento: '32.145.890/0001-44',
    telefone: '(11) 98122-3344',
    email: 'compras@alvoradaconstrutora.com.br',
    endereco_obra: 'Av. dos Ipês, 450 - Canteiro de Obras 02',
    bairro: 'Jardim América',
    cidade: 'São Paulo',
    saldo_devedor: 0.00,
    historico_financeiro: [
      { data: '2026-09-15', tipo: 'QUITACAO', valor: 12300.00, pedido_id: 'PED-1024', obs: 'Pagamento total via Pix' }
    ],
    observacoes: 'Descarga liberada das 08h às 17h. Acesso fácil para caminhão toco.'
  },
  {
    id: 'cli_2',
    nome: 'Fazenda & Sítio Boa Esperança (Sr. Darcy)',
    documento: '145.882.308-54',
    telefone: '(11) 99455-1212',
    email: 'darcy.esperanca@agro.com.br',
    endereco_obra: 'Estrada Vicinal do Ribeirão, Km 8 - Porteira Verde',
    bairro: 'Zona Rural / Represa',
    cidade: 'Atibaia',
    saldo_devedor: 0.00,
    historico_financeiro: [],
    observacoes: 'Estrada de terra batida. Não mandar caminhão truck se estiver chovendo forte.'
  },
  {
    id: 'cli_3',
    nome: 'Eng. Marcos Aurelio Obra',
    documento: '231.908.454-71',
    telefone: '(11) 97333-8899',
    email: 'marcosaurelio.eng@gmail.com',
    endereco_obra: 'Rua das Palmeiras, 112 - Sobrado em Reforma',
    bairro: 'Vila Nova',
    cidade: 'São Paulo',
    saldo_devedor: 450.00, // Alerta: Saldo em aberto!
    pedido_pendente_ref: '#1018',
    historico_financeiro: [
      { data: '2026-09-28', tipo: 'PENDURA', valor: 450.00, pedido_id: 'PED-1018', obs: 'Diferença de frete e pregos pendurados' }
    ],
    observacoes: 'Cliente pontual, porém restam R$ 450,00 da última entrega da Vila Nova.'
  },
  {
    id: 'cli_4',
    nome: 'Residencial Quinta da Baronesa (Dra. Camila)',
    documento: '092.341.768-15',
    telefone: '(11) 98877-6655',
    email: 'camila.nogueira@med.com.br',
    endereco_obra: 'Alameda das Acácias, Lote 42 - Condomínio Fechado',
    bairro: 'Alphaville / Tamboré',
    cidade: 'Santana de Parnaíba',
    saldo_devedor: 0.00,
    historico_financeiro: [],
    observacoes: 'Portaria exige identificação do motorista e placa do caminhão com 24h de antecedência.'
  },
  {
    id: 'cli_5',
    nome: 'Marcenaria & Telhados Rústicos (Marcio)',
    documento: '45.671.293/0001-18',
    telefone: '(11) 99188-2233',
    email: 'rusticos.marcio@uol.com.br',
    endereco_obra: 'Rua da Olaria, 89 - Galpão 3',
    bairro: 'Distrito Industrial',
    cidade: 'Guarulhos',
    saldo_devedor: -200.00, // Crédito a favor de R$ 200,00
    historico_financeiro: [
      { data: '2026-10-02', tipo: 'CREDITO', valor: 200.00, pedido_id: 'DEP-ANTECIPADO', obs: 'Adiantamento em dinheiro' }
    ],
    observacoes: 'Possui crédito antecipado de R$ 200,00 para abater na próxima compra.'
  }
];

const SEED_CARPINTEIROS = [
  {
    id: 'carp_1',
    nome: 'Mestre João Telhadista',
    telefone: '(11) 98455-0101',
    especialidade: 'Telhados Coloniais e Estruturas Pesadas',
    comissao_padrao_pct: 4.0,
    total_indicado_mes: 24620.00,
    pedidos_indicados_qtd: 6,
    comissao_acumulada: 984.80,
    comissao_paga: 700.00,
    saldo_a_pagar: 284.80
  },
  {
    id: 'carp_2',
    nome: 'Carlos Carpinteiro',
    telefone: '(11) 97233-1122',
    especialidade: 'Decks de Piscina, Pergolados e Forros',
    comissao_padrao_pct: 3.0,
    total_indicado_mes: 8920.00,
    pedidos_indicados_qtd: 2,
    comissao_acumulada: 267.60,
    comissao_paga: 0.00,
    saldo_a_pagar: 267.60
  },
  {
    id: 'carp_3',
    nome: 'Eng. Marcos Obra',
    telefone: '(11) 97333-8899',
    especialidade: 'Construção Civil Geral e Caixaria',
    comissao_padrao_pct: 5.0,
    total_indicado_mes: 15750.00,
    pedidos_indicados_qtd: 4,
    comissao_acumulada: 787.50,
    comissao_paga: 787.50,
    saldo_a_pagar: 0.00
  }
];

const SEED_FUNCIONARIOS = [
  {
    id: 'func_1',
    nome: 'Rodrigo Silveira',
    cargo: 'Vendedor de Balcão',
    telefone: '(11) 98112-3344',
    email: 'rodrigo@serraria.com.br',
    comissao_pct: 2.0,
    salario_base: 2200.00,
    pix: 'rodrigo@serraria.com.br',
    ativo: true,
    vendas_mes: 42500.00,
    comissao_acumulada: 850.00,
    comissao_paga: 500.00,
    saldo_comissao: 350.00
  },
  {
    id: 'func_2',
    nome: 'Amanda Mendes',
    cargo: 'Vendedora de Madeiras & Projetos',
    telefone: '(11) 97654-2211',
    email: 'amanda.mendes@serraria.com.br',
    comissao_pct: 2.5,
    salario_base: 2400.00,
    pix: '11976542211',
    ativo: true,
    vendas_mes: 58200.00,
    comissao_acumulada: 1455.00,
    comissao_paga: 1000.00,
    saldo_comissao: 455.00
  },
  {
    id: 'func_3',
    nome: 'Sebastião "Tião" Ramos',
    cargo: 'Mestre de Serra & Plaina',
    telefone: '(11) 99344-7788',
    email: 'tiao.serra@serraria.com.br',
    comissao_pct: 0.0,
    salario_base: 3100.00,
    pix: 'tiao.ramos@gmail.com',
    ativo: true,
    vendas_mes: 0.00,
    comissao_acumulada: 0.00,
    comissao_paga: 0.00,
    saldo_comissao: 0.00
  },
  {
    id: 'func_4',
    nome: 'Valdir Moreira',
    cargo: 'Motorista & Encarregado de Cargas',
    telefone: '(11) 98899-0011',
    email: 'valdir.caminhao@serraria.com.br',
    comissao_pct: 0.0,
    salario_base: 2600.00,
    pix: 'valdir.moreira@outlook.com',
    ativo: true,
    vendas_mes: 0.00,
    comissao_acumulada: 0.00,
    comissao_paga: 0.00,
    saldo_comissao: 0.00
  },
  {
    id: 'func_5',
    nome: 'Carlos Eduardo (Gerente Geral)',
    cargo: 'Gerente Geral',
    telefone: '(11) 99122-8800',
    email: 'gerencia@serraria.com.br',
    comissao_pct: 1.0,
    salario_base: 5500.00,
    pix: 'gerencia@serraria.com.br',
    ativo: true,
    vendas_mes: 125320.00,
    comissao_acumulada: 1253.20,
    comissao_paga: 1253.20,
    saldo_comissao: 0.00
  }
];

const SEED_CONFIG = {
  senha_gerente: '1234',
  desconto_maximo_livre: 5.0,
  taxa_plaina_padrao_ml: 3.50,
  taxa_plaina_padrao_m2: 8.00,
  meta_faturamento_mensal: 150000.00,
  percentual_preco_bruto: 20.0,
  nome_madeireira: 'Serraria e Madeireira Bom Jesus',
  cnpj_madeireira: '16.482.988/0001-02',
  telefone_madeireira: '(12) 99603-3793',
  endereco_madeireira: 'Av. Adhemar Pinto de Siqueira, 1000 - Vila Galvão, Caçapava - SP, 12286-325',
  logradouro: 'Avenida Adhemar Pinto de Siqueira, 1000',
  bairro: 'Vila Galvão',
  cep: '12286-325',
  municipio: 'Caçapava',
  cidade: 'Caçapava',
  estado: 'São Paulo'
};

const SEED_PAGAMENTOS_COMISSAO = [
  {
    id: 'pag_com_1',
    data: '2026-10-05T14:20:00',
    beneficiario_tipo: 'CARPINTEIRO',
    beneficiario_id: 'carp_1',
    beneficiario_nome: 'Mestre João Telhadista',
    valor: 700.00,
    forma_pagamento: 'Pix',
    comprovante_obs: 'Adiantamento quinzenal de comissões de telhados'
  },
  {
    id: 'pag_com_2',
    data: '2026-10-08T17:10:00',
    beneficiario_tipo: 'VENDEDOR',
    beneficiario_id: 'func_2',
    beneficiario_nome: 'Amanda Mendes',
    valor: 1000.00,
    forma_pagamento: 'Pix',
    comprovante_obs: 'Fechamento parcial de comissão de vendas'
  },
  {
    id: 'pag_com_3',
    data: '2026-10-10T11:45:00',
    beneficiario_tipo: 'CARPINTEIRO',
    beneficiario_id: 'carp_3',
    beneficiario_nome: 'Eng. Marcos Obra',
    valor: 787.50,
    forma_pagamento: 'Transferência Bancária',
    comprovante_obs: 'Quitação integral de indicações das obras Loteamento'
  }
];

const SEED_AUDITORIA_DESCONTOS = [
  {
    id: 'aud_1',
    data: '2026-10-14T10:15:00',
    pedido_numero: 1021,
    cliente_nome: 'Construtora Alvorada Ltda',
    vendedor_nome: 'Rodrigo Silveira',
    valor_pedido: 18450.00,
    desconto_pct: 8.0,
    desconto_valor: 1476.00,
    motivo: 'Volume alto de vigas de peroba para condomínio fechado'
  },
  {
    id: 'aud_2',
    data: '2026-10-13T16:40:00',
    pedido_numero: 1019,
    cliente_nome: 'Marcenaria & Telhados Rústicos',
    vendedor_nome: 'Amanda Mendes',
    valor_pedido: 6320.00,
    desconto_pct: 6.5,
    desconto_valor: 410.80,
    motivo: 'Parceria contínua de retirada quinzenal'
  }
];

const SEED_USUARIOS = [
  {
    id: 'usr_admin',
    username: 'admin',
    nome: 'Carlos Eduardo (Gerente Geral)',
    email: 'gerencia@serraria.com.br',
    senha: 'admin',
    perfil: 'ADMIN', // ADMIN: Acesso Total
    cargo: 'Gerente Geral & Administrador',
    funcionario_id: 'func_5',
    ativo: true,
    data_criacao: '2026-01-01T08:00:00'
  },
  {
    id: 'usr_rodrigo',
    username: 'rodrigo',
    nome: 'Rodrigo Silveira',
    email: 'rodrigo@serraria.com.br',
    senha: '123',
    perfil: 'FUNCIONARIO', // FUNCIONARIO: Apenas Balcão, Pátio, Histórico e Consulta
    cargo: 'Vendedor de Balcão',
    funcionario_id: 'func_1',
    ativo: true,
    data_criacao: '2026-01-15T09:00:00'
  },
  {
    id: 'usr_amanda',
    username: 'amanda',
    nome: 'Amanda Mendes',
    email: 'amanda.mendes@serraria.com.br',
    senha: '123',
    perfil: 'FUNCIONARIO',
    cargo: 'Vendedora de Madeiras & Projetos',
    funcionario_id: 'func_2',
    ativo: true,
    data_criacao: '2026-02-01T09:30:00'
  }
];

const SEED_BAIRROS = [
  { nome: 'Vila Galvão (Sede / Próximo)', valor_frete: 30.00, prazo_horas: 12 },
  { nome: 'Centro (Caçapava)', valor_frete: 35.00, prazo_horas: 12 },
  { nome: 'Vila Menino Jesus', valor_frete: 40.00, prazo_horas: 12 },
  { nome: 'Jardim Maria Cândida', valor_frete: 45.00, prazo_horas: 24 },
  { nome: 'Vila Santos', valor_frete: 45.00, prazo_horas: 24 },
  { nome: 'Distrito Industrial', valor_frete: 60.00, prazo_horas: 24 },
  { nome: 'Zona Rural / Estrada Velha', valor_frete: 100.00, prazo_horas: 48 },
  { nome: 'Retira no Pátio (Sem Frete)', valor_frete: 0.00, prazo_horas: 0 }
];

const SEED_PEDIDOS = [
  {
    id: 'PED-1021',
    numero: 1021,
    data_criacao: '2026-10-14T09:30:00',
    validade_dias: 7,
    status: 'ORCAMENTO', // ORCAMENTO, APROVADO, CANCELADO, ENTREGUE
    etapa_patio: 'NAO_ENVIADO', // NAO_ENVIADO, CORTE_PLAINA, SEPARACAO, PRONTO_CARREGAR, SAIU_ENTREGA, ENTREGUE
    cliente: {
      id: 'cli_2',
      nome: 'Fazenda & Sítio Boa Esperança (Sr. Darcy)',
      documento: '145.882.308-54',
      telefone: '(11) 99455-1212',
      endereco_obra: 'Estrada Vicinal do Ribeirão, Km 8 - Porteira Verde',
      bairro: 'Zona Rural / Represa',
      cidade: 'Atibaia',
      observacoes: 'Orçamento para reforma da tulha de café.'
    },
    carpinteiro_id: 'carp_1',
    carpinteiro_nome: 'Mestre João Telhadista',
    itens: [
      {
        id: 'item_1',
        produto_id: 'prod_988',
        codigo: '1-793',
        descricao: 'VIGA EUCALIPTO 5X20',
        largura_cm: 20,
        acabamento: 'BRUTA',
        aparelhar: false,
        tipo_calculo: 'ML',
        quantidade: 10,
        comprimento_m: 5.0,
        metragem_total: 50.0,
        valor_unitario: 54.00,
        taxa_plaina: 0.0,
        subtotal: 2700.00,
        volume_m3: 0.36,
        peso_kg: 316.8
      },
      {
        id: 'item_2',
        produto_id: 'prod_823',
        codigo: 'T-647',
        descricao: 'TABUA EUCALIPTO 15 CM',
        largura_cm: 15,
        acabamento: 'BRUTA',
        aparelhar: false,
        tipo_calculo: 'ML',
        quantidade: 30,
        comprimento_m: 4.0,
        metragem_total: 120.0,
        valor_unitario: 23.50,
        taxa_plaina: 0.0,
        subtotal: 2820.00,
        volume_m3: 0.36,
        peso_kg: 316.8
      },
      {
        id: 'item_3',
        produto_id: 'prod_729',
        codigo: '1-555',
        descricao: 'PREGO 19X36 C/C - KG',
        largura_cm: 0,
        acabamento: 'BRUTA',
        aparelhar: false,
        tipo_calculo: 'UN',
        quantidade: 10,
        comprimento_m: 0,
        metragem_total: 10,
        valor_unitario: 19.50,
        taxa_plaina: 0.0,
        subtotal: 195.00,
        volume_m3: 0.003,
        peso_kg: 10.0
      }
    ],
    resumo_fisico: {
      total_pecas: 50,
      volume_total_m3: 0.723,
      peso_total_kg: 643.6,
      veiculo_sugerido: 'Picape Leve / Utilitário (Strada / Fiorino / S10)'
    },
    resumo_financeiro: {
      subtotal_itens: 5715.00,
      taxa_aparelhamento: 0.00,
      valor_frete: 250.00,
      bairro_frete: 'Zona Rural / Represa',
      desconto_tipo: 'VALOR',
      desconto_valor: 125.00,
      desconto_percentual: 2.19,
      desconto_autorizado: true,
      valor_total: 5840.00,
      forma_pagamento: 'Pix',
      valor_sinal: 0.00,
      saldo_a_receber: 5840.00
    },
    checklist_patio: [],
    observacoes_venda: 'Aguardando confirmação do telhadista para fechar compra.'
  },
  {
    id: 'PED-1022',
    numero: 1022,
    data_criacao: '2026-10-14T11:15:00',
    validade_dias: 7,
    status: 'APROVADO',
    etapa_patio: 'CORTE_PLAINA', // Na Serra / Plaina
    cliente: {
      id: 'cli_4',
      nome: 'Residencial Quinta da Baronesa (Dra. Camila)',
      documento: '092.341.768-15',
      telefone: '(11) 98877-6655',
      endereco_obra: 'Alameda das Acácias, Lote 42 - Condomínio Fechado',
      bairro: 'Alphaville / Tamboré',
      cidade: 'Santana de Parnaíba',
      observacoes: 'Pergolado e Deck de piscina.'
    },
    carpinteiro_id: 'carp_2',
    carpinteiro_nome: 'Carlos Carpinteiro',
    itens: [
      {
        id: 'item_1022_1',
        produto_id: 'prod_987',
        codigo: '1-792',
        descricao: 'VIGA EUCALIPTO 5X15',
        largura_cm: 15,
        acabamento: 'APARELHADA',
        aparelhar: true,
        tipo_calculo: 'ML',
        quantidade: 12,
        comprimento_m: 5.0,
        metragem_total: 60.0,
        valor_unitario: 46.50,
        taxa_plaina: 3.50,
        subtotal: 3000.00, // 60 * (46.50 + 3.50)
        volume_m3: 0.432,
        peso_kg: 367.2
      },
      {
        id: 'item_1022_2',
        produto_id: 'prod_440',
        codigo: 'MAT-440',
        descricao: 'FORRO PVC BRANCO GELO REGUA 200 MM X 3,50 (0,70 M²)',
        largura_cm: 20,
        acabamento: 'BRUTA', // Já beneficiado
        aparelhar: false,
        tipo_calculo: 'M2',
        quantidade: 24, // 24 m²
        comprimento_m: 0,
        metragem_total: 24.0,
        valor_unitario: 245.00,
        taxa_plaina: 0.0,
        subtotal: 5880.00,
        volume_m3: 0.48,
        peso_kg: 456.0
      }
    ],
    resumo_fisico: {
      total_pecas: 36,
      volume_total_m3: 0.912,
      peso_total_kg: 823.2,
      veiculo_sugerido: 'Picape Leve / Utilitário (Strada / Fiorino / S10)'
    },
    resumo_financeiro: {
      subtotal_itens: 8670.00,
      taxa_aparelhamento: 210.00, // 60m * 3.50
      valor_frete: 180.00,
      bairro_frete: 'Alphaville / Tamboré',
      desconto_tipo: 'VALOR',
      desconto_valor: 140.00,
      desconto_percentual: 1.58,
      desconto_autorizado: true,
      valor_total: 8920.00,
      forma_pagamento: 'Pix',
      valor_sinal: 4000.00,
      saldo_a_receber: 4920.00 // Cobrar na entrega!
    },
    checklist_patio: [
      { item_id: 'item_1022_1', descricao: 'VIGA EUCALIPTO 5X15 (12 pcs x 5.0m) - APARELHAR', cortado: false, carregado: false, requer_plaina: true },
      { item_id: 'item_1022_2', descricao: 'Forro PVC Branco Gelo (24 m²)', cortado: true, carregado: false, requer_plaina: false }
    ],
    observacoes_venda: 'Vigas precisam de acabamento fino de plaina 4 faces. Entregar na sexta-feira às 10h.'
  },
  {
    id: 'PED-1023',
    numero: 1023,
    data_criacao: '2026-10-14T14:20:00',
    validade_dias: 7,
    status: 'APROVADO',
    etapa_patio: 'PRONTO_CARREGAR', // Pronto para Carregar
    cliente: {
      id: 'cli_3',
      nome: 'Eng. Marcos Aurelio Obra',
      documento: '231.908.454-71',
      telefone: '(11) 97333-8899',
      endereco_obra: 'Rua das Palmeiras, 112 - Sobrado em Reforma',
      bairro: 'Vila Nova',
      cidade: 'São Paulo',
      observacoes: 'Alerta de saldo devedor anterior de R$ 450,00.'
    },
    carpinteiro_id: 'carp_3',
    carpinteiro_nome: 'Eng. Marcos Obra',
    itens: [
      {
        id: 'item_1023_1',
        produto_id: 'prod_831',
        codigo: 'T-655',
        descricao: 'TABUA PINUS 20CM X 3MTS',
        largura_cm: 20,
        acabamento: 'BRUTA',
        aparelhar: false,
        tipo_calculo: 'UN',
        quantidade: 40,
        comprimento_m: 3.0,
        metragem_total: 40,
        valor_unitario: 36.00,
        taxa_plaina: 0.0,
        subtotal: 1440.00,
        volume_m3: 0.60,
        peso_kg: 300.0
      },
      {
        id: 'item_1023_2',
        produto_id: 'prod_833',
        codigo: 'T-657',
        descricao: 'TABUA PINUS 30CM X 3MTS',
        largura_cm: 30,
        acabamento: 'BRUTA',
        aparelhar: false,
        tipo_calculo: 'UN',
        quantidade: 30,
        comprimento_m: 3.0,
        metragem_total: 30,
        valor_unitario: 52.00,
        taxa_plaina: 0.0,
        subtotal: 1560.00,
        volume_m3: 0.675,
        peso_kg: 337.5
      },
      {
        id: 'item_1023_3',
        produto_id: 'prod_829',
        codigo: 'T-653',
        descricao: 'TABUA PINUS 10CM X 3MTS',
        largura_cm: 10,
        acabamento: 'BRUTA',
        aparelhar: false,
        tipo_calculo: 'ML',
        quantidade: 25,
        comprimento_m: 3.0,
        metragem_total: 75.0,
        valor_unitario: 4.80,
        taxa_plaina: 0.0,
        subtotal: 360.00,
        volume_m3: 0.093,
        peso_kg: 46.8
      },
      {
        id: 'item_1023_4',
        produto_id: 'prod_721',
        codigo: '1-547',
        descricao: 'PREGO 17X21 C/C - KG',
        largura_cm: 0,
        acabamento: 'BRUTA',
        aparelhar: false,
        tipo_calculo: 'UN',
        quantidade: 5,
        comprimento_m: 0,
        metragem_total: 5,
        valor_unitario: 18.50,
        taxa_plaina: 0.0,
        subtotal: 92.50,
        volume_m3: 0.0015,
        peso_kg: 5.0
      }
    ],
    resumo_fisico: {
      total_pecas: 100,
      volume_total_m3: 1.369,
      peso_total_kg: 689.3,
      veiculo_sugerido: 'Picape Leve / Utilitário (Strada / Fiorino / S10)'
    },
    resumo_financeiro: {
      subtotal_itens: 3452.50,
      taxa_aparelhamento: 0.00,
      valor_frete: 60.00,
      bairro_frete: 'Vila Nova',
      desconto_tipo: 'VALOR',
      desconto_valor: 62.50,
      desconto_percentual: 1.81,
      desconto_autorizado: true,
      valor_total: 3450.00,
      forma_pagamento: 'Dinheiro',
      valor_sinal: 1000.00,
      saldo_a_receber: 2450.00 // Cobrar no ato do descarregamento!
    },
    checklist_patio: [
      { item_id: 'item_1023_1', descricao: 'Tábua Pinus 2.5x20 (40 pcs x 3.0m)', cortado: true, carregado: true, requer_plaina: false },
      { item_id: 'item_1023_2', descricao: 'Tábua Pinus 2.5x30 (30 pcs x 3.0m)', cortado: true, carregado: true, requer_plaina: false },
      { item_id: 'item_1023_3', descricao: 'Sarrafo Pinus 2.5x5 (25 pcs x 3.0m)', cortado: true, carregado: true, requer_plaina: false },
      { item_id: 'item_1023_4', descricao: 'Prego 17x21 (5 Kg)', cortado: true, carregado: true, requer_plaina: false }
    ],
    observacoes_venda: 'Motorista: Cobrar saldo de R$ 2.450,00 antes de descarregar.'
  },
  {
    id: 'PED-1024',
    numero: 1024,
    data_criacao: '2026-10-13T08:00:00',
    validade_dias: 7,
    status: 'ENTREGUE',
    etapa_patio: 'ENTREGUE', // Entregue e Quitado
    cliente: {
      id: 'cli_1',
      nome: 'Construtora Alvorada Ltda (Eng. Roberto)',
      documento: '32.145.890/0001-44',
      telefone: '(11) 98122-3344',
      endereco_obra: 'Av. dos Ipês, 450 - Canteiro de Obras 02',
      bairro: 'Jardim América',
      cidade: 'São Paulo',
      observacoes: 'Estrutura do telhado do barracão principal.'
    },
    carpinteiro_id: 'carp_1',
    carpinteiro_nome: 'Mestre João Telhadista',
    itens: [
      {
        id: 'item_1024_1',
        produto_id: 'prod_987',
        codigo: '1-792',
        descricao: 'VIGA EUCALIPTO 5X15',
        largura_cm: 15,
        acabamento: 'BRUTA',
        aparelhar: false,
        tipo_calculo: 'ML',
        quantidade: 35,
        comprimento_m: 6.0,
        metragem_total: 210.0,
        valor_unitario: 38.00,
        taxa_plaina: 0.0,
        subtotal: 7980.00,
        volume_m3: 1.512,
        peso_kg: 1300.3
      },
      {
        id: 'item_1024_2',
        produto_id: 'prod_870',
        codigo: 'T-681',
        descricao: 'TELHA BARRO BELO PORTUGUESA E ROMANA RESINADA CADA',
        largura_cm: 0,
        acabamento: 'BRUTA',
        aparelhar: false,
        tipo_calculo: 'UN',
        quantidade: 1500,
        comprimento_m: 0,
        metragem_total: 1500,
        valor_unitario: 2.85,
        taxa_plaina: 0.0,
        subtotal: 4275.00,
        volume_m3: 2.7,
        peso_kg: 3300.0
      }
    ],
    resumo_fisico: {
      total_pecas: 1535,
      volume_total_m3: 4.212,
      peso_total_kg: 4600.3,
      veiculo_sugerido: 'Caminhão Toco Médio (MB 1620 / Atego)'
    },
    resumo_financeiro: {
      subtotal_itens: 12255.00,
      taxa_aparelhamento: 0.00,
      valor_frete: 80.00,
      bairro_frete: 'Jardim América',
      desconto_tipo: 'VALOR',
      desconto_valor: 35.00,
      desconto_percentual: 0.28,
      desconto_autorizado: true,
      valor_total: 12300.00,
      forma_pagamento: 'Pix',
      valor_sinal: 12300.00,
      saldo_a_receber: 0.00
    },
    checklist_patio: [
      { item_id: 'item_1024_1', descricao: 'VIGA EUCALIPTO 5X15 (35 pcs x 6.0m)', cortado: true, carregado: true, requer_plaina: false },
      { item_id: 'item_1024_2', descricao: 'Telha Portuguesa e Romana Resinada (1.500 un)', cortado: true, carregado: true, requer_plaina: false }
    ],
    observacoes_venda: 'Entregue com sucesso no dia 14/10 pela manhã. Motorista: Zé do Caminhão.'
  }
];

const DB = {
  get(key, defaultValue = []) {
    try {
      if (typeof window === 'undefined' || typeof localStorage === 'undefined') return defaultValue;
      const data = localStorage.getItem(key);
      return data ? JSON.parse(data) : defaultValue;
    } catch (e) {
      console.error(`Erro ao ler ${key}:`, e);
      return defaultValue;
    }
  },

  set(key, value) {
    try {
      if (typeof window === 'undefined' || typeof localStorage === 'undefined') return true;
      localStorage.setItem(key, JSON.stringify(value));
      return true;
    } catch (e) {
      console.error(`Erro ao salvar ${key}:`, e);
      return false;
    }
  },

  init() {
    // Inicia seed se não existir ou se faltar campo estoque_atual
    const prodsSalvos = this.get(STORAGE_KEYS.PRODUTOS, null);
    if (!prodsSalvos || prodsSalvos.length < 50 || prodsSalvos.some(p => p.estoque_atual === undefined)) {
      this.set(STORAGE_KEYS.PRODUTOS, SEED_PRODUTOS);
    }
    if (!localStorage.getItem(STORAGE_KEYS.CLIENTES)) {
      this.set(STORAGE_KEYS.CLIENTES, SEED_CLIENTES);
    }
    if (!localStorage.getItem(STORAGE_KEYS.CARPINTEIROS)) {
      this.set(STORAGE_KEYS.CARPINTEIROS, SEED_CARPINTEIROS);
    }
    if (!localStorage.getItem(STORAGE_KEYS.BAIRROS)) {
      this.set(STORAGE_KEYS.BAIRROS, SEED_BAIRROS);
    }
    if (!localStorage.getItem(STORAGE_KEYS.PEDIDOS)) {
      this.set(STORAGE_KEYS.PEDIDOS, SEED_PEDIDOS);
    }
    if (!localStorage.getItem(STORAGE_KEYS.FUNCIONARIOS)) {
      this.set(STORAGE_KEYS.FUNCIONARIOS, SEED_FUNCIONARIOS);
    }
    const cfgAtual = this.get(STORAGE_KEYS.CONFIG, null);
    if (!cfgAtual || !cfgAtual.endereco_madeireira || cfgAtual.nome_madeireira?.includes('Três Barras') || cfgAtual.nome_madeireira?.includes('Rio Verde')) {
      this.set(STORAGE_KEYS.CONFIG, { ...(cfgAtual || {}), ...SEED_CONFIG });
    }
    if (!localStorage.getItem(STORAGE_KEYS.PAGAMENTOS_COMISSAO)) {
      this.set(STORAGE_KEYS.PAGAMENTOS_COMISSAO, SEED_PAGAMENTOS_COMISSAO);
    }
    if (!localStorage.getItem(STORAGE_KEYS.AUDITORIA_DESCONTOS)) {
      this.set(STORAGE_KEYS.AUDITORIA_DESCONTOS, SEED_AUDITORIA_DESCONTOS);
    }
    if (!localStorage.getItem(STORAGE_KEYS.USUARIOS)) {
      this.set(STORAGE_KEYS.USUARIOS, SEED_USUARIOS);
    }
  },

  resetDemo() {
    this.set(STORAGE_KEYS.PRODUTOS, SEED_PRODUTOS);
    this.set(STORAGE_KEYS.CLIENTES, SEED_CLIENTES);
    this.set(STORAGE_KEYS.CARPINTEIROS, SEED_CARPINTEIROS);
    this.set(STORAGE_KEYS.BAIRROS, SEED_BAIRROS);
    this.set(STORAGE_KEYS.PEDIDOS, SEED_PEDIDOS);
    this.set(STORAGE_KEYS.FUNCIONARIOS, SEED_FUNCIONARIOS);
    this.set(STORAGE_KEYS.CONFIG, SEED_CONFIG);
    this.set(STORAGE_KEYS.PAGAMENTOS_COMISSAO, SEED_PAGAMENTOS_COMISSAO);
    this.set(STORAGE_KEYS.AUDITORIA_DESCONTOS, SEED_AUDITORIA_DESCONTOS);
    this.set(STORAGE_KEYS.USUARIOS, SEED_USUARIOS);
  },

  // Helpers de Usuários e Autenticação
  getUsuarios() {
    return this.get(STORAGE_KEYS.USUARIOS, SEED_USUARIOS);
  },

  salvarUsuario(usr) {
    const list = this.getUsuarios();
    const idx = list.findIndex(u => u.id === usr.id);
    if (idx >= 0) {
      list[idx] = usr;
    } else {
      if (!usr.id) usr.id = 'usr_' + Date.now();
      list.push(usr);
    }
    this.set(STORAGE_KEYS.USUARIOS, list);
    return usr;
  },

  excluirUsuario(id) {
    const list = this.getUsuarios().filter(u => u.id !== id);
    this.set(STORAGE_KEYS.USUARIOS, list);
  },

  // Helpers específicos
  getFuncionarios() {
    return this.get(STORAGE_KEYS.FUNCIONARIOS, SEED_FUNCIONARIOS);
  },

  salvarFuncionario(func) {
    const list = this.getFuncionarios();
    const idx = list.findIndex(f => f.id === func.id);
    if (idx >= 0) {
      list[idx] = func;
    } else {
      if (!func.id) func.id = 'func_' + Date.now();
      list.push(func);
    }
    this.set(STORAGE_KEYS.FUNCIONARIOS, list);
    return func;
  },

  excluirFuncionario(id) {
    const list = this.getFuncionarios().filter(f => f.id !== id);
    this.set(STORAGE_KEYS.FUNCIONARIOS, list);
  },

  getConfig() {
    const cfg = this.get(STORAGE_KEYS.CONFIG, SEED_CONFIG);
    if (cfg && cfg.percentual_preco_bruto === undefined) {
      cfg.percentual_preco_bruto = 20.0;
    }
    return cfg;
  },

  salvarConfig(cfg) {
    this.set(STORAGE_KEYS.CONFIG, cfg);
    return cfg;
  },

  getPagamentosComissao() {
    return this.get(STORAGE_KEYS.PAGAMENTOS_COMISSAO, SEED_PAGAMENTOS_COMISSAO);
  },

  registrarPagamentoComissao(pag) {
    const list = this.getPagamentosComissao();
    if (!pag.id) pag.id = 'pag_com_' + Date.now();
    if (!pag.data) pag.data = new Date().toISOString();
    list.unshift(pag);
    this.set(STORAGE_KEYS.PAGAMENTOS_COMISSAO, list);

    // Abate o saldo da comissão
    const valorPago = parseFloat(pag.valor) || 0;
    if (pag.beneficiario_tipo === 'VENDEDOR') {
      const funcs = this.getFuncionarios();
      const f = funcs.find(item => item.id === pag.beneficiario_id);
      if (f) {
        f.comissao_paga = (parseFloat(f.comissao_paga) || 0) + valorPago;
        f.saldo_comissao = Math.max(0, (parseFloat(f.comissao_acumulada) || 0) - f.comissao_paga);
        this.set(STORAGE_KEYS.FUNCIONARIOS, funcs);
      }
    } else if (pag.beneficiario_tipo === 'CARPINTEIRO') {
      const carps = this.getCarpinteiros();
      const c = carps.find(item => item.id === pag.beneficiario_id);
      if (c) {
        c.comissao_paga = (parseFloat(c.comissao_paga) || 0) + valorPago;
        c.saldo_a_pagar = Math.max(0, (parseFloat(c.comissao_acumulada) || 0) - c.comissao_paga);
        this.set(STORAGE_KEYS.CARPINTEIROS, carps);
      }
    }

    return pag;
  },

  getAuditoriaDescontos() {
    return this.get(STORAGE_KEYS.AUDITORIA_DESCONTOS, SEED_AUDITORIA_DESCONTOS);
  },

  registrarAuditoriaDesconto(reg) {
    const list = this.getAuditoriaDescontos();
    if (!reg.id) reg.id = 'aud_' + Date.now();
    if (!reg.data) reg.data = new Date().toISOString();
    list.unshift(reg);
    this.set(STORAGE_KEYS.AUDITORIA_DESCONTOS, list);
    return reg;
  },

  // Helpers específicos
  getProdutos() {
    let prods = this.get(STORAGE_KEYS.PRODUTOS, null);
    if (!prods || !Array.isArray(prods) || prods.length < 50) {
      const v3 = this.get('serraria_produtos_v3', null);
      const v2 = this.get('serraria_produtos_v2', null);
      const v1 = this.get('serraria_produtos_v1', null);
      if (Array.isArray(v3) && v3.length >= 50) prods = v3;
      else if (Array.isArray(v2) && v2.length >= 50) prods = v2;
      else if (Array.isArray(v1) && v1.length >= 50) prods = v1;
      else prods = JSON.parse(JSON.stringify(SEED_PRODUTOS));

      this.set(STORAGE_KEYS.PRODUTOS, prods);
    }

    let alterado = false;
    prods.forEach(p => {
      if (p.estoque_atual === undefined || p.estoque_atual === null || isNaN(p.estoque_atual)) {
        p.estoque_atual = 0;
        alterado = true;
      } else {
        p.estoque_atual = Number(p.estoque_atual);
      }
      if (p.preco_unitario === undefined || p.preco_unitario === null || isNaN(p.preco_unitario)) {
        p.preco_unitario = 0;
        alterado = true;
      } else {
        p.preco_unitario = Number(p.preco_unitario);
      }
      if (p.estoque_minimo === undefined || p.estoque_minimo === null) {
        p.estoque_minimo = 10;
        alterado = true;
      }
      if (p.ativo === undefined) {
        p.ativo = true;
        alterado = true;
      }
    });
    if (alterado) {
      this.set(STORAGE_KEYS.PRODUTOS, prods);
    }
    return prods;
  },

  restaurarEstoquePadrao() {
    const fresh = JSON.parse(JSON.stringify(SEED_PRODUTOS));
    this.set(STORAGE_KEYS.PRODUTOS, fresh);
    return fresh;
  },

  gerarProximoCodigo() {
    const prods = this.getProdutos();
    let max = 1000;
    prods.forEach(p => {
      const match = (p.codigo || '').match(/\d+/);
      if (match) {
        const n = parseInt(match[0], 10);
        if (n > max && n < 90000) max = n;
      }
    });
    return `MAT-${max + 1}`;
  },

  salvarProduto(prod) {
    const list = this.getProdutos();
    const idx = list.findIndex(p => p.id === prod.id);
    if (idx >= 0) {
      list[idx] = Object.assign({}, list[idx], prod);
    } else {
      if (!prod.id) prod.id = 'prod_' + Date.now();
      list.push(prod);
    }
    this.set(STORAGE_KEYS.PRODUTOS, list);
    return prod;
  },

  excluirProduto(prodId) {
    const list = this.getProdutos().filter(p => p.id !== prodId);
    this.set(STORAGE_KEYS.PRODUTOS, list);
    return true;
  },

  ajustarEstoque(prodId, deltaOuValor, ehDireto = false) {
    const list = this.getProdutos();
    const prod = list.find(p => p.id === prodId);
    if (!prod) return null;
    
    const valor = parseFloat(deltaOuValor) || 0;
    if (ehDireto) {
      prod.estoque_atual = Math.max(0, valor);
    } else {
      prod.estoque_atual = Math.max(0, (parseFloat(prod.estoque_atual) || 0) + valor);
    }
    this.set(STORAGE_KEYS.PRODUTOS, list);
    return prod;
  },

  getClientes() {
    return this.get(STORAGE_KEYS.CLIENTES, SEED_CLIENTES);
  },

  getCarpinteiros() {
    return this.get(STORAGE_KEYS.CARPINTEIROS, SEED_CARPINTEIROS);
  },

  getBairros() {
    return this.get(STORAGE_KEYS.BAIRROS, SEED_BAIRROS);
  },

  getBairrosFrete() {
    return this.getBairros();
  },

  getPedidos() {
    const pedidos = this.get(STORAGE_KEYS.PEDIDOS, SEED_PEDIDOS);
    // Garante retrocompatibilidade para que todo item possua largura_cm
    pedidos.forEach(p => {
      if (Array.isArray(p.itens)) {
        p.itens.forEach(it => {
          if (it.largura_cm === undefined || it.largura_cm === null) {
            const m = it.descricao ? it.descricao.match(/(?:^|\s)(\d+(?:[.,]\d+)?)\s*[xX]\s*(\d+(?:[.,]\d+)?)/) : null;
            if (m && m[2]) {
              it.largura_cm = parseFloat(m[2].replace(',', '.')) || 0;
            } else {
              const mCm = it.descricao ? it.descricao.match(/(?:^|\s)(\d+(?:[.,]\d+)?)\s*(?:cm|CM)\b/) : null;
              it.largura_cm = mCm ? (parseFloat(mCm[1].replace(',', '.')) || 0) : 0;
            }
          }
        });
      }
    });
    return pedidos;
  },

  getNextNumeroPedido() {
    const pedidos = this.getPedidos();
    if (!pedidos.length) return 1025;
    const max = Math.max(...pedidos.map(p => p.numero || 1000));
    return max + 1;
  },

  salvarPedido(pedido) {
    const pedidos = this.getPedidos();
    const index = pedidos.findIndex(p => 
      (pedido.id && p.id === pedido.id) || 
      (pedido.numero && p.numero === pedido.numero)
    );

    if (index >= 0) {
      // Atualiza o orçamento existente em cima do anterior (sem duplicar)
      pedido.data_atualizacao = new Date().toISOString();
      pedidos[index] = pedido;
    } else {
      // Novo orçamento: insere no topo do histórico
      if (!pedido.data_criacao) pedido.data_criacao = new Date().toISOString();
      pedidos.unshift(pedido);
    }
    this.set(STORAGE_KEYS.PEDIDOS, pedidos);

    // Se tiver cliente vinculado, atualizar histórico se necessário
    if (pedido.cliente && pedido.cliente.nome) {
      this.garantirCliente(pedido.cliente);
    }

    return pedido;
  },

  garantirCliente(clienteData) {
    const clientes = this.getClientes();
    let cliente = clientes.find(c => 
      (c.id && c.id === clienteData.id) ||
      (c.documento && clienteData.documento && c.documento === clienteData.documento) ||
      (c.telefone && clienteData.telefone && c.telefone.replace(/\D/g, '') === clienteData.telefone.replace(/\D/g, '')) ||
      (c.nome && clienteData.nome && c.nome.trim().toLowerCase() === clienteData.nome.trim().toLowerCase())
    );

    if (cliente) {
      // Atualiza dados
      cliente.nome = clienteData.nome || cliente.nome;
      cliente.telefone = clienteData.telefone || cliente.telefone;
      cliente.documento = clienteData.documento || cliente.documento;
      cliente.endereco_obra = clienteData.endereco_obra || cliente.endereco_obra;
      cliente.bairro = clienteData.bairro || cliente.bairro;
      cliente.cidade = clienteData.cidade || cliente.cidade;
      this.set(STORAGE_KEYS.CLIENTES, clientes);
      return cliente;
    } else {
      // Novo cliente auto-cadastrado
      const novoCliente = {
        id: 'cli_' + Date.now(),
        nome: clienteData.nome || 'Cliente Balcão',
        documento: clienteData.documento || '',
        telefone: clienteData.telefone || '',
        email: clienteData.email || '',
        endereco_obra: clienteData.endereco_obra || '',
        bairro: clienteData.bairro || '',
        cidade: clienteData.cidade || 'Caçapava',
        saldo_devedor: 0.00,
        historico_financeiro: [],
        observacoes: 'Cadastrado automaticamente via Balcão de Vendas'
      };
      clientes.push(novoCliente);
      this.set(STORAGE_KEYS.CLIENTES, clientes);
      return novoCliente;
    }
  }
};

// Inicializa o banco de dados no carregamento
if (typeof window !== 'undefined' && typeof localStorage !== 'undefined') {
  DB.init();
}

/**
 * UTILITÁRIO GLOBAL DE MÁSCARA INTELIGENTE E IDENTIFICAÇÃO DE DOCUMENTO (CPF / CNPJ)
 * - Permite digitar apenas números
 * - Formata dinamicamente com pontos, traços e barras
 * - Reconhece e identifica em tempo real se é CPF (até 11 dígitos) ou CNPJ (12 a 14 dígitos)
 * - Valida dígitos verificadores oficiais
 */
const DocMascara = {
  formatar(value) {
    if (!value) return '';
    const d = String(value).replace(/\D/g, '').slice(0, 14);
    if (!d.length) return '';
    if (d.length <= 11) {
      if (d.length <= 3) return d;
      if (d.length <= 6) return d.slice(0, 3) + '.' + d.slice(3);
      if (d.length <= 9) return d.slice(0, 3) + '.' + d.slice(3, 6) + '.' + d.slice(6);
      return d.slice(0, 3) + '.' + d.slice(3, 6) + '.' + d.slice(6, 9) + '-' + d.slice(9);
    } else {
      let res = d.slice(0, 2) + '.' + d.slice(2, 5) + '.' + d.slice(5, 8) + '/' + d.slice(8, 12);
      if (d.length > 12) {
        res += '-' + d.slice(12);
      }
      return res;
    }
  },

  validarCPF(cpfDigits) {
    if (cpfDigits.length !== 11) return false;
    if (/^(\d)\1{10}$/.test(cpfDigits)) return false;
    let soma = 0;
    for (let i = 0; i < 9; i++) soma += parseInt(cpfDigits[i], 10) * (10 - i);
    let resto = (soma * 10) % 11;
    if (resto === 10 || resto === 11) resto = 0;
    if (resto !== parseInt(cpfDigits[9], 10)) return false;
    soma = 0;
    for (let i = 0; i < 10; i++) soma += parseInt(cpfDigits[i], 10) * (11 - i);
    resto = (soma * 10) % 11;
    if (resto === 10 || resto === 11) resto = 0;
    return resto === parseInt(cpfDigits[10], 10);
  },

  validarCNPJ(cnpjDigits) {
    if (cnpjDigits.length !== 14) return false;
    if (/^(\d)\1{13}$/.test(cnpjDigits)) return false;
    const pesos1 = [5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2];
    let soma = 0;
    for (let i = 0; i < 12; i++) soma += parseInt(cnpjDigits[i], 10) * pesos1[i];
    let resto = soma % 11;
    const dig1 = resto < 2 ? 0 : 11 - resto;
    if (dig1 !== parseInt(cnpjDigits[12], 10)) return false;
    const pesos2 = [6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2];
    soma = 0;
    for (let i = 0; i < 13; i++) soma += parseInt(cnpjDigits[i], 10) * pesos2[i];
    resto = soma % 11;
    const dig2 = resto < 2 ? 0 : 11 - resto;
    return dig2 === parseInt(cnpjDigits[13], 10);
  },

  identificar(value) {
    const d = String(value || '').replace(/\D/g, '');
    if (!d.length) return null;
    if (d.length <= 11) {
      const completo = d.length === 11;
      const valido = completo ? this.validarCPF(d) : false;
      return {
        tipo: 'CPF',
        completo,
        valido,
        texto: valido ? '✓ CPF Válido' : (completo ? 'CPF (11 dígitos)' : `CPF (${d.length}/11)`),
        classe: valido ? 'badge-valido' : 'badge-cpf'
      };
    } else {
      const completo = d.length === 14;
      const valido = completo ? this.validarCNPJ(d) : false;
      return {
        tipo: 'CNPJ',
        completo,
        valido,
        texto: valido ? '✓ CNPJ Válido' : (completo ? 'CNPJ (14 dígitos)' : `CNPJ (${d.length}/14)`),
        classe: valido ? 'badge-valido' : 'badge-cnpj'
      };
    }
  },

  aplicar(input, badgeEl = null) {
    if (!input) return;

    const atualizar = () => {
      const rawDigits = input.value.replace(/\D/g, '').slice(0, 14);
      const formatted = this.formatar(rawDigits);
      if (input.value !== formatted) {
        input.value = formatted;
      }
      if (badgeEl) {
        const info = this.identificar(rawDigits);
        if (!info) {
          badgeEl.style.display = 'none';
          badgeEl.textContent = '';
          badgeEl.className = 'doc-badge';
        } else {
          badgeEl.style.display = 'inline-flex';
          badgeEl.textContent = info.texto;
          badgeEl.className = `doc-badge ${info.classe}`;
        }
      }
    };

    input.addEventListener('keydown', (e) => {
      if (
        e.key.length === 1 &&
        !/\d/.test(e.key) &&
        !e.ctrlKey &&
        !e.metaKey &&
        !e.altKey
      ) {
        e.preventDefault();
      }
    });

    input.addEventListener('input', atualizar);
    input.addEventListener('change', atualizar);

    atualizar();
  },

  formatarTelefone(digits) {
    if (!digits) return '';
    let d = String(digits).replace(/\D/g, '');
    if (d.length === 12 && d.startsWith('0')) d = d.slice(1);
    d = d.slice(0, 11);
    if (!d.length) return '';
    if (d.length <= 2) return `(${d}`;
    if (d.length <= 6) return `(${d.slice(0, 2)}) ${d.slice(2)}`;
    if (d.length <= 10) return `(${d.slice(0, 2)}) ${d.slice(2, 6)}-${d.slice(6)}`;
    return `(${d.slice(0, 2)}) ${d.slice(2, 7)}-${d.slice(7)}`;
  },

  aplicarTelefone(input) {
    if (!input) return;
    const atualizar = () => {
      const formatted = this.formatarTelefone(input.value);
      if (input.value !== formatted) {
        input.value = formatted;
      }
    };
    input.addEventListener('keydown', (e) => {
      if (
        e.key.length === 1 &&
        !/\d/.test(e.key) &&
        !e.ctrlKey &&
        !e.metaKey &&
        !e.altKey
      ) {
        e.preventDefault();
      }
    });
    input.addEventListener('input', atualizar);
    input.addEventListener('change', atualizar);
    atualizar();
  }
};

if (typeof window !== 'undefined') {
  window.DocMascara = DocMascara;
  window.DB = DB;
  window.STORAGE_KEYS = STORAGE_KEYS;
  window.SEED_PRODUTOS = SEED_PRODUTOS;
}



export { DB, DocMascara, STORAGE_KEYS, SEED_PRODUTOS, SEED_BAIRROS, SEED_CLIENTES, SEED_CARPINTEIROS, SEED_PEDIDOS, SEED_FUNCIONARIOS, SEED_CONFIG, SEED_PAGAMENTOS_COMISSAO, SEED_AUDITORIA_DESCONTOS, SEED_USUARIOS };
