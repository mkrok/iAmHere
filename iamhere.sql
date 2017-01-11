-- MySQL dump 10.13  Distrib 5.5.53, for debian-linux-gnu (i686)
--
-- Host: localhost    Database: iamhere
-- ------------------------------------------------------
-- Server version	5.5.53-0ubuntu0.14.04.1

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `_13a`
--

DROP TABLE IF EXISTS `_13a`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `_13a` (
  `aa` varchar(30) DEFAULT NULL,
  `ab` varchar(50) NOT NULL,
  `ac` varchar(500) NOT NULL,
  `ad` varchar(30) DEFAULT NULL,
  `ae` bigint(20) DEFAULT NULL,
  `af` tinyint(1) DEFAULT NULL,
  `ag` varchar(30) DEFAULT NULL,
  `ah` varchar(30) DEFAULT NULL,
  PRIMARY KEY (`ab`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `_13a`
--

LOCK TABLES `_13a` WRITE;
/*!40000 ALTER TABLE `_13a` DISABLE KEYS */;
INSERT INTO `_13a` VALUES ('1/2 18:54','Agnieszka','ac6fd7ea27c882cdc1555a7c2269f0d6e8dec3bd11ee9e5e927530ded7ea1b9ce3a35ce9a1dd46eb1a545000bda11551822b58625cb4e117430d3b8ee1b4e069','1/9 18:04',612525856583,NULL,'185.3.114.84','Earth'),('12/30 12:11','Ania','4db77a4263dabbc081fe48708c43ab6f8bca5e0d5e2bc3be2807059d09236dc53daa2b7b46f51205244dae19aa51781a2686536bfe5219c981c7b5b29855b0c0','1/9 18:07',241479682045,NULL,'94.254.146.207','Earth'),('1/8 18:42','Asia','dc0615fdc83211ea3d643348e6447b5c06823f9ce5c430578ade3a04ad8fce052ff59599fa5817fd23f24d1eacf79cf18c1aca1290cb35b92334b6a7d1b57613','1/9 17:56',1132401349380,NULL,'83.4.192.71','Earth'),('1/5 3:57','Hogwarts','da841f3dc51c537c884f460e497cd0c2424cf36f58b528f9b04fb52b0ad0b0dbacf413fcd1254d7414c170c9cc5594f1b440595ec252339eb93e709071047285','1/9 17:37',1416805803263,NULL,'185.3.114.84','Earth'),('1/2 9:17','Mirek','e832386914dacc6f97909120079a2da7a2e9649900ae5bc3636444b58c78114be79ddb2f239656061c42ed9184623d8b7065b42e1245e36a615c4a8e92331605','1/9 21:32',505177968774,NULL,'185.3.114.84','Earth'),('12/30 13:57','mk12ok','cef446763dcae57a61e3c7b3effae2333c27d99ba7ada1ec68875c32fced97a1da8573c0a8ab65e17bc472f5316909bf597e159452e3f5f05cbf9432220b3522','1/8 15:10',1107126937071,NULL,'185.3.114.84','Earth'),('12/30 16:26','mkrok','84664a5878010a6ffbdbe09aa50b469705a287b4455d94ef050391411b1b7e6f786867bcba101f17834e2f5afb34ee19654b90e5a1c269e8a82821190917ead2','1/8 12:36',537492039345,NULL,'185.3.114.84','Earth'),('12/26 5:02','nikhendricks43','141934f4978938a5c487eb2b026da501769089f1daa3ccff1d835f5e026e79def462fdc4bb1f4d3a621fee82bdb585b9bc153ed4a71b95b0577c8bc077090121','1/2 15:59',227699744221,NULL,'204.185.8.240','Earth');
/*!40000 ALTER TABLE `_13a` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `_13b`
--

DROP TABLE IF EXISTS `_13b`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `_13b` (
  `ba` varchar(30) COLLATE utf8mb4_bin DEFAULT NULL,
  `bb` varchar(50) COLLATE utf8mb4_bin DEFAULT NULL,
  `bc` varchar(30) COLLATE utf8mb4_bin DEFAULT NULL,
  `bd` char(255) COLLATE utf8mb4_bin DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `_13b`
--

LOCK TABLES `_13b` WRITE;
/*!40000 ALTER TABLE `_13b` DISABLE KEYS */;
INSERT INTO `_13b` VALUES ('1/7 14:03','Wenus','Mirek','Jednak nie bylo UTF-8'),('1/7 14:03','Wenus','Mirek','Wyczyscilem wszystko i mozemy zaczynac od nowa'),('1/7 23:03','Wenus','Aaaa','Siema'),('1/7 23:03','Wenus','Aaaa',''),('1/7 23:04','Wenus','Aaaa','Może dzisiaj uda się zasnąć'),('1/8 12:24','Wenus','Mirek','Na jednym telefonie działa a na drugim nie'),('1/8 12:25','Wenus','Mirek','Very strejndż'),('1/8 15:50','Wenus','Mirek','Te Twoje ikonki się nie zapisuja w mysql'),('1/8 15:51','Wenus','Mirek','Lecę na Earth :)'),('1/8 16:23','Wenus','Mirek','Dzialaja ikonki pisane po staremu jako dwukropki i nawiasy'),('1/8 17:42','Wenus','Mirek','Juz wiem ze nie dziala na androidzie 4'),('1/8 17:58','Wenus','Mirek','To znaczy dziala.. slabiej ;)'),('1/8 18:49','Wenus','Asia','Jeszcze byłoby fajnie mieć jakąś listę ogólnodostępnych planet'),('1/8 18:50','Wenus','Asia','Wlazłam na Wenus i teraz nie pamiętam jak się nazywa ta, która otwiera się po zalogowaniu do apki'),('1/8 18:50','Wenus','Asia','Jak tam wrócić?'),('1/8 19:46','Wenus','Mirek','Wlasnie o to chodzi'),('1/8 19:47','Wenus','Mirek','Zeby to byla tajemnica'),('1/8 19:48','Wenus','Mirek','Wtedy nikt nie wie ze jestes'),('1/8 19:50','Wenus','Mirek','O co chodzi z tym dopasowaniem okna?'),('1/8 19:51','Wenus','Mirek','Nie bardzo rozumiem'),('1/8 19:52','Wenus','Mirek','Juz wiem'),('1/8 19:53','Wenus','Mirek','Tak jest wtedy kiedy jest malo linii'),('1/8 20:06','Wenus','Mirek',':)'),('1/8 23:09','Wenus','Mirek','A może trzeba kodować utf-16'),('1/8 23:12','Wenus','Mirek','Cztery bajty na znak'),('1/8 23:18','Wenus','Mirek','Tak zrobimy'),('1/8 23:30','Wenus','Mirek','????'),('1/8 23:31','Wenus','Mirek','????'),('1/8 23:32','Wenus','Mirek','Niestety nic nie działa'),('1/8 23:32','Wenus','Mirek','Nawet utf32'),('1/8 23:32','Wenus','Mirek','Nie tedy droga'),('1/8 23:33','Wenus','Mirek','Wracamy do utf8 i zaczynamy myśleć :)'),('1/8 23:40','Wenus','Mirek','Szkoda ze Cie nie ma'),('1/9 0:02','Wenus','Mirek','????'),('1/9 0:03','Wenus','Mirek','4 pytajniki oznaczają że to ikonka'),('1/9 0:03','Wenus','Mirek',':)'),('1/9 0:08','Wenus','Mirek',' /j Earth'),('1/9 0:25','Wenus','Mirek','?'),('1/9 0:26','Wenus','Mirek','Działa ?'),('1/9 0:27','Wenus','Mirek','I takich małych problemów są dziesiątki codziennie'),('1/9 0:27','Wenus','Mirek','Mam ich długą listę'),('1/9 0:27','Wenus','Mirek','☺️????'),('1/9 11:01','Earth','Hogwarts','Chat cleared'),('1/9 16:04','Earth','Mirek',':)'),('1/9 16:04','Earth','Ania','Stoję'),('1/9 16:04','Earth','Ania','Stoję'),('1/9 16:04','Earth','Ania','Stoję'),('1/9 16:07','Earth','Mirek','Widzę gdzie jesteś'),('1/9 16:08','Earth','Ania','Jadę'),('1/9 16:08','Earth','Ania','A ta apka'),('1/9 16:08','Earth','Ania','Działa w tle ?'),('1/9 16:09','Earth','Mirek','Oks'),('1/9 16:09','Earth','Mirek','Działa'),('1/9 16:09','Earth','Mirek','Właśnie musimy to testować'),('1/9 16:09','Earth','Hogwarts','moim zdaniem działa :D'),('1/9 16:25','Earth','Ania','Nie wiem czemu'),('1/9 16:25','Earth','Ania','Się wyłączyło'),('1/9 16:26','Earth','Ania','Ale znalazłam denerwujący błąd'),('1/9 16:26','Earth','Mirek','U mnie działa'),('1/9 16:26','Earth','Mirek','Jaki?'),('1/9 16:27','Earth','Ania','Powiem ci domu'),('1/9 16:27','Earth','Ania','Jestem już blisko'),('1/9 16:27','Earth','Ania','Jak widzisz'),('1/9 16:27','Earth','Mirek','Widzę'),('1/9 16:28','Earth','Ania','Jakiś pan śmierdzi'),('1/9 16:28','Earth','Ania','I próbuję nie oddychać'),('1/9 16:33','Earth','Ania','Siema'),('1/9 16:52','Earth','Mirek','Test'),('1/9 17:09','Earth','Mirek','Działa dobrze?'),('1/9 17:28','Earth','Asia','Hej'),('1/9 17:29','Earth','Hogwarts','hej'),('1/9 17:29','Earth','Mirek','Wszystko działa coraz lepiej'),('1/9 17:30','Earth','Asia','A czemu nie dziala mi wpisywanie tekstu  jak jeżdżę paluchem po klawiaturze'),('1/9 17:30','Earth','Asia','?'),('1/9 17:30','Earth','Asia','Jak sie to nazywa?'),('1/9 17:30','Earth','Asia','Działało wcześniej'),('1/9 17:31','Earth','Hogwarts','to wina Twojej klawiatury'),('1/9 17:31','Earth','Asia','Wiesz co mam na myśli?'),('1/9 17:32','Earth','Hogwarts','wiem'),('1/9 17:32','Earth','Hogwarts','rysujesz po klawiaturze a ona odgaduje Twoje mysli?'),('1/9 17:32','Earth','Asia','Czekaj zobacze w innej aplikacji, bo zawsze tego używam a nic nie przestawialam'),('1/9 17:33','Earth','Mirek','U mnie to działa'),('1/9 17:33','Earth','Mirek','A jaka masz klawiaturę?'),('1/9 17:34','Earth','Asia','Dupa, tu nie dziala, a w wiadomosciach dziala'),('1/9 17:34','Earth','Mirek','Wyłączyłem tak zwane autocomplection'),('1/9 17:34','Earth','Asia','A moze ja mam jakąś stara wersje'),('1/9 17:34','Earth','Mirek','Nie'),('1/9 17:34','Earth','Mirek','Masz najnowsza'),('1/9 17:34','Earth','Asia','Hm'),('1/9 17:35','Earth','Mirek','Jaka masz klawiaturę?'),('1/9 17:35','Earth','Mirek','Ja mam SwiftKey i działa jak złoto'),('1/9 17:35','Earth','Asia','Ladną ?'),('1/9 17:35','Earth','Mirek','?'),('1/9 17:36','Earth','Mirek','To czekaj, włączę to z powrotem'),('1/9 17:36','Earth','Mirek','Musisz zamknąć i otworzyć apke'),('1/9 17:48','Earth','Asia','Ja mam klawiature xperia'),('1/9 17:48','Earth','Asia','Halo'),('1/9 17:48','Earth','Asia','Hm'),('1/9 17:48','Earth','Hogwarts','a teraz?'),('1/9 17:49','Earth','Hogwarts','teraz działa?'),('1/9 17:49','Earth','Asia','Nie'),('1/9 17:49','Earth','Asia','Zrestartować aplikacje?'),('1/9 17:49','Earth','Mirek','To nie jest moja wina :('),('1/9 17:49','Earth','Mirek','Tak!!!!'),('1/9 17:49','Earth','Asia','Ok'),('1/9 17:49','Earth','Asia','To czekaj chwilke'),('1/9 17:50','Earth','Asia','Test'),('1/9 17:50','Earth','Asia','Działa'),('1/9 17:51','Earth','Asia','Hura!!!'),('1/9 17:51','Earth','Mirek','Ale ona teraz podpowiada treść'),('1/9 17:51','Earth','Asia','No tak'),('1/9 17:51','Earth','Asia','I dobrze'),('1/9 17:51','Earth','Asia','Czy źle?'),('1/9 17:51','Earth','Mirek','Niektórzy tego nie lubią'),('1/9 17:52','Earth','Asia','Mnie to nie przeszkadza'),('1/9 17:52','Earth','Mirek','A ja mi powiedziała że to jest okropne'),('1/9 17:52','Earth','Mirek','Ale... jakbyś miała SwiftKey.. :)'),('1/9 17:52','Earth','Asia','Jak się nazwa to wprowadzenie testu jeżdżeniem po klawiaturze?'),('1/9 17:52','Earth','Mirek','Widzisz Agnieszkę?'),('1/9 17:53','Earth','Asia','Widzę ???'),('1/9 17:53','Earth','Asia','Gdzieś tam kolo Kleparza jest'),('1/9 17:53','Earth','Mirek','To się nazywa swiping keyboard'),('1/9 17:53','Earth','Asia','No'),('1/9 17:53','Earth','Mirek','Albo swype'),('1/9 17:54','Earth','Asia','To przy takim podpowiadanie nie przeszkadza'),('1/9 17:54','Earth','Mirek','Te podpowiedzi zasłaniają mi cały ekran'),('1/9 17:54','Earth','Asia','Tak?'),('1/9 17:54','Earth','Asia','A mnie nie ?'),('1/9 17:55','Earth','Mirek','Jak wyłącze podpowiedzi to Ci nie działa'),('1/9 17:55','Earth','Asia','No tak'),('1/9 17:55','Earth','Mirek','A moja klawiatura działa normalnie'),('1/9 17:55','Earth','Asia','Czekaj to może uda mi się zmienić ta klawiaturę'),('1/9 17:56','Earth','Asia','Buuu'),('1/9 17:57','Earth','Asia','Nie mam takiej'),('1/9 17:57','Earth','Mirek','W sklepie Play'),('1/9 17:57','Earth','Asia','I znow nie dziala swipe'),('1/9 17:57','Earth','Mirek','Swiftkey'),('1/9 17:57','Earth','Mirek','Bo wyłączyłem'),('1/9 17:57','Earth','Asia','Oki'),('1/9 17:58','Earth','Mirek','To podpowiadamy jest okropne'),('1/9 17:59','Earth','Asia','Instaluje'),('1/9 17:59','Earth','Asia','???'),('1/9 17:59','Earth','Mirek','?'),('1/9 18:01','Earth','Mirek','To jest tak poza tym bardzo dobra klawiatura'),('1/9 18:01','Earth','Mirek','Dużo umie'),('1/9 18:03','Earth','Asia','Hej'),('1/9 18:03','Earth','Asia','Działa'),('1/9 18:03','Earth','Mirek','Hurra'),('1/9 18:03','Earth','Mirek','To się nazywa kompromis'),('1/9 18:03','Earth','Asia','I mam podpowiadanie'),('1/9 18:04','Earth','Asia','A gdzie tu są emotikony?'),('1/9 18:04','Earth','Mirek','Szukaj :)'),('1/9 18:05','Earth','Asia','?'),('1/9 18:05','Earth','Mirek','Pod prawym dolnym klawiszem'),('1/9 18:05','Earth','Asia','?'),('1/9 18:05','Earth','Asia','?'),('1/9 18:05','Earth','Asia','No to najważniejsze'),('1/9 18:05','Earth','Asia','Idę już'),('1/9 18:05','Earth','Asia','Pa'),('1/9 18:06','Earth','Asia','Fajnie działa Twoja aplikacja'),('1/9 18:06','Earth','Mirek','Coraz lepiej'),('1/9 18:06','Earth','Mirek','Pa'),('1/9 18:06','Earth','Asia','I wiem gdzie jest Aga ?'),('1/9 18:06','Earth','Asia','Albo Ania'),('1/9 18:06','Earth','Asia','?'),('1/9 18:07','Earth','Asia','Same A'),('1/9 18:07','Earth','Mirek','Teraz jada');
/*!40000 ALTER TABLE `_13b` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `_13c`
--

DROP TABLE IF EXISTS `_13c`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `_13c` (
  `ca` varchar(30) DEFAULT NULL,
  `cb` varchar(30) DEFAULT NULL,
  `cc` varchar(30) DEFAULT NULL,
  `cd` char(255) CHARACTER SET utf8 DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `_13c`
--

LOCK TABLES `_13c` WRITE;
/*!40000 ALTER TABLE `_13c` DISABLE KEYS */;
INSERT INTO `_13c` VALUES ('1/9 17:17','Hogwarts','Ania','można wysyłac prywatne wiadomości'),('1/9 17:17','Hogwarts','Ania','jak się chce ;)'),('1/9 17:31','Mirek','Asia','Musisz coś ustawić w telefonie'),('1/9 18:09','Mirek','Ania','Widzę Was');
/*!40000 ALTER TABLE `_13c` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2017-01-09 22:08:22
