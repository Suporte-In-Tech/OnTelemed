-- CFM 2.314/2022 Art. 3Âº, III - Rastreabilidade da versÃ£o do TCLE aceito pelo paciente
-- Campo nullable: pacientes existentes terÃ£o NULL (aceite anterior ao versionamento)
-- Novos cadastros recebem a versÃ£o "1.0" automaticamente via registerService.ts

ALTER TABLE "pacientes" ADD COLUMN IF NOT EXISTS "tcle_version" VARCHAR(10) DEFAULT '1.0';
