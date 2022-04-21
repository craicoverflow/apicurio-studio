--
-- PostgreSQL database dump
--

-- Dumped from database version 12.9 (Debian 12.9-1.pgdg110+1)
-- Dumped by pg_dump version 12.9 (Debian 12.9-1.pgdg110+1)

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: format; Type: TYPE; Schema: public; Owner: user
--

CREATE TYPE public.format AS ENUM (
    'json',
    'yaml'
);


ALTER TYPE public.format OWNER TO "user";

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: rulesets; Type: TABLE; Schema: public; Owner: user
--

CREATE TABLE public.rulesets (
    id integer NOT NULL,
    config character varying NOT NULL,
    display_name text NOT NULL,
    format public.format NOT NULL
);


ALTER TABLE public.rulesets OWNER TO "user";

--
-- Name: rulesets_id_seq; Type: SEQUENCE; Schema: public; Owner: user
--

CREATE SEQUENCE public.rulesets_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.rulesets_id_seq OWNER TO "user";

--
-- Name: rulesets_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: user
--

ALTER SEQUENCE public.rulesets_id_seq OWNED BY public.rulesets.id;


--
-- Name: rulesets id; Type: DEFAULT; Schema: public; Owner: user
--

ALTER TABLE ONLY public.rulesets ALTER COLUMN id SET DEFAULT nextval('public.rulesets_id_seq'::regclass);


--
-- PostgreSQL database dump complete
--

