-- Sara Valenti V2 - Migration 001 : tables e-commerce
-- A executer dans le dashboard Supabase : SQL Editor
-- Projet : a creer sur https://supabase.com → New project

-- ============================================================
-- Adresses de livraison
-- ============================================================
CREATE TABLE IF NOT EXISTS adresses (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  nom         TEXT NOT NULL,
  prenom      TEXT NOT NULL,
  rue         TEXT NOT NULL,
  complement  TEXT,
  code_postal TEXT NOT NULL,
  ville       TEXT NOT NULL,
  pays        TEXT NOT NULL DEFAULT 'FR',
  telephone   TEXT,
  est_principale BOOLEAN NOT NULL DEFAULT FALSE,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE adresses ENABLE ROW LEVEL SECURITY;

CREATE POLICY "adresses_select_own" ON adresses
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "adresses_insert_own" ON adresses
  FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "adresses_update_own" ON adresses
  FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "adresses_delete_own" ON adresses
  FOR DELETE USING (auth.uid() = user_id);

-- ============================================================
-- Commandes
-- ============================================================
CREATE TABLE IF NOT EXISTS commandes (
  id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id             UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  stripe_session_id   TEXT UNIQUE,
  stripe_payment_id   TEXT,
  statut              TEXT NOT NULL DEFAULT 'en_attente',
  -- statuts : en_attente | paye | expedition | livre | annule | rembourse
  total               NUMERIC(10, 2) NOT NULL,
  sous_total          NUMERIC(10, 2),
  tarif_livraison     NUMERIC(10, 2),
  transporteur        TEXT,
  lignes              JSONB NOT NULL DEFAULT '[]',
  -- [{slug, nom, couleur, sku, prix, quantite, photoUrl}]
  adresse_livraison   JSONB,
  -- {nom, prenom, rue, complement, code_postal, ville, pays, telephone}
  email_client        TEXT,
  created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at          TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE commandes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "commandes_select_own" ON commandes
  FOR SELECT USING (auth.uid() = user_id);
-- INSERT et UPDATE par service_role uniquement (webhooks Stripe)

-- Trigger mise a jour updated_at
CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER commandes_updated_at
  BEFORE UPDATE ON commandes
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

-- ============================================================
-- Favoris
-- ============================================================
CREATE TABLE IF NOT EXISTS favoris (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  produit_slug TEXT NOT NULL,
  couleur     TEXT,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (user_id, produit_slug, couleur)
);

ALTER TABLE favoris ENABLE ROW LEVEL SECURITY;

CREATE POLICY "favoris_select_own" ON favoris
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "favoris_insert_own" ON favoris
  FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "favoris_delete_own" ON favoris
  FOR DELETE USING (auth.uid() = user_id);

-- ============================================================
-- Index
-- ============================================================
CREATE INDEX IF NOT EXISTS commandes_user_id_idx ON commandes(user_id);
CREATE INDEX IF NOT EXISTS commandes_stripe_session_idx ON commandes(stripe_session_id);
CREATE INDEX IF NOT EXISTS favoris_user_id_idx ON favoris(user_id);
CREATE INDEX IF NOT EXISTS adresses_user_id_idx ON adresses(user_id);
