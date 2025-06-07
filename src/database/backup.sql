--
-- PostgreSQL database dump
--

-- Dumped from database version 16.4
-- Dumped by pg_dump version 16.4

-- Started on 2025-06-06 22:01:56

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
-- TOC entry 4871 (class 0 OID 39491)
-- Dependencies: 218
-- Data for Name: rewards; Type: TABLE DATA; Schema: public; Owner: PointsAdmin
--

COPY public.rewards (id, name, description, "pointsCost", "isActive", stock, "createdAt", "updatedAt") FROM stdin;
469cdb61-a7cf-499b-96e0-31c3ec9a1bb8	Regalo de Prueba	Recompensa para pruebas	15	t	10	2025-06-05 19:31:03.702234	2025-06-05 19:31:03.702234
70215ce0-8b78-4f52-b01d-6bf58583f446	Recompensa Costosa	Recompensa que cuesta más que el saldo disponible	10	t	5	2025-06-05 19:37:28.386287	2025-06-05 19:37:28.386287
3809364c-2d17-4a30-a981-c22736885957	Recompensa Costosa	Recompensa que cuesta más que el saldo disponible	10	t	5	2025-06-05 19:38:47.545961	2025-06-05 19:38:47.545961
\.


--
-- TOC entry 4869 (class 0 OID 39471)
-- Dependencies: 216
-- Data for Name: transactions; Type: TABLE DATA; Schema: public; Owner: PointsAdmin
--

COPY public.transactions (id, "userId", type, points, description, reference, date) FROM stdin;
21556a9a-89e3-43bc-bce2-d6b5d1062836	bc1c6128-1080-44ec-825e-e5cec83472fb	earn	10	Compra registrada por 100.5	PURCHASE-1749085875596-4us3hhegf	2025-06-04 20:11:15.648
875e790c-fa36-47d2-9f88-6c8ad9ba5b64	bc1c6128-1080-44ec-825e-e5cec83472fb	earn	10	Compra registrada por 100.5	PURCHASE-1749085964742-w2722dla2	2025-06-04 20:12:44.758
89ece6b0-5fda-427c-a721-e3f1d462b5ec	bc1c6128-1080-44ec-825e-e5cec83472fb	redeem	-15	Redención: Regalo de Prueba	\N	2025-06-05 19:32:44.667
bad58369-ba4f-4125-b3bf-f4e26af868ed	bc1c6128-1080-44ec-825e-e5cec83472fb	earn	10	Compra registrada por 100	PURCHASE-1749172553889-0zsaryqco	2025-06-05 20:15:53.937
19516d41-c565-4ab9-a844-492ab8cdf4dd	bc1c6128-1080-44ec-825e-e5cec83472fb	redeem	-15	Redención: Regalo de Prueba	\N	2025-06-05 20:16:04.349
378596c7-d6a0-4b1c-b9a5-79c5816aace1	bc1c6128-1080-44ec-825e-e5cec83472fb	earn	15	Compra registrada por 150	PURCHASE-1749172616915-txs0nr19c	2025-06-05 20:16:56.973
e8dbe435-524b-4b25-b7c1-582b5d2f6605	bc1c6128-1080-44ec-825e-e5cec83472fb	earn	10	Compra registrada por 100	PURCHASE-1749172743828-i0xn14p7v	2025-06-05 20:19:03.885
9e35a4db-5779-4191-bd6c-82ee4979cd68	bc1c6128-1080-44ec-825e-e5cec83472fb	earn	10	Compra registrada por 100.5	PURCHASE-1749260387750-nz3msp97i	2025-06-06 20:39:47.839
95b84b36-f51e-4a2e-86a1-65138dad444d	bc1c6128-1080-44ec-825e-e5cec83472fb	earn	10	Compra registrada por 100.5	PURCHASE-1749260638007-i03bcvpma	2025-06-06 20:43:58.031
264ccad4-5a24-424a-a5db-b9661b071165	bc1c6128-1080-44ec-825e-e5cec83472fb	earn	10	Compra registrada por 100.5	PURCHASE-1749262456298-7daxo1gd3	2025-06-06 21:14:16.365
\.


--
-- TOC entry 4870 (class 0 OID 39480)
-- Dependencies: 217
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: PointsAdmin
--

COPY public.users (id, name, "totalPoints", "createdAt", "updatedAt") FROM stdin;
bc1c6128-1080-44ec-825e-e5cec83472fb	Usuario de Prueba	55	2025-06-04 20:08:45.841129	2025-06-04 20:08:45.841129
\.


-- Completed on 2025-06-06 22:01:57

--
-- PostgreSQL database dump complete
--

