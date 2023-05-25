import 'package:animate_do/animate_do.dart';
import 'package:awesome_icons/awesome_icons.dart';
import 'package:carousel_slider/carousel_slider.dart';
import 'package:flutter/material.dart';
import 'package:url_launcher/url_launcher.dart';

import '../data/data.dart';

class MyHomePage extends StatefulWidget {
  const MyHomePage({super.key});

  @override
  State<MyHomePage> createState() => _MyHomePageState();
}

class _MyHomePageState extends State<MyHomePage> {
  final controller = ScrollController();
  final CarouselController _carouselController = CarouselController();

  @override
  Widget build(BuildContext context) {
    return Scaffold(
        backgroundColor: const Color.fromARGB(255, 0, 39, 71),
        body: NestedScrollView(
            controller: controller,
            physics: const BouncingScrollPhysics(
                parent: AlwaysScrollableScrollPhysics()),
            headerSliverBuilder: (context, value) {
              return [
                SliverAppBar(
                  pinned: true,
                  stretch: true,
                  toolbarHeight: 80,
                  backgroundColor: Colors.transparent,
                  expandedHeight: MediaQuery.of(context).size.height / 2,
                  flexibleSpace: FlexibleSpaceBar(
                    collapseMode: CollapseMode.parallax,
                    stretchModes: const <StretchMode>[
                      StretchMode.zoomBackground,
                      StretchMode.blurBackground,
                      StretchMode.fadeTitle,
                    ],
                    centerTitle: true,
                    expandedTitleScale: 3,
                    title: FadeIn(
                        duration: const Duration(seconds: 2),
                        child: AnimatedContainer(
                          duration: const Duration(seconds: 2),
                          decoration: BoxDecoration(
                              border: Border.all(color: Colors.black, width: 1),
                              shape: BoxShape.circle),
                          child: ClipRRect(
                            borderRadius: BorderRadius.circular(50),
                            child: Image.asset(
                              "assets/image/pp.jpg",
                              height: 60,
                              width: 60,
                              fit: BoxFit.cover,
                            ),
                          ),
                        )),
                    background: Stack(
                      fit: StackFit.expand,
                      children: <Widget>[
                        Padding(
                            padding: const EdgeInsets.only(top: 10),
                            child: SizedBox(
                              width: MediaQuery.of(context).size.width / 1,
                              child: Image.asset(
                                "assets/image/banner.jpeg",
                                fit: BoxFit.cover,
                              ),
                            )),
                        Container(
                          decoration: BoxDecoration(
                              gradient: LinearGradient(
                                  begin: Alignment.bottomRight,
                                  end: Alignment.topRight,
                                  colors: [
                                for (double i = 1; i >= 0; i -= 0.01)
                                  const Color.fromARGB(255, 0, 39, 71)
                                      .withOpacity(i),
                              ])),
                        )
                      ],
                    ),
                  ),
                ),
                SliverList(
                  delegate: SliverChildListDelegate(
                    <Widget>[
                      const Padding(
                        padding: EdgeInsets.only(top: 10),
                        child: Text(
                          "Antoine Gonthier",
                          style: TextStyle(
                            fontSize: 34,
                            fontWeight: FontWeight.w600,
                            letterSpacing: 0.96,
                            color: Colors.white,
                          ),
                          textAlign: TextAlign.center,
                        ),
                      ),
                      const SizedBox(
                        height: 20,
                      ),
                      const Center(
                          child: Padding(
                              padding: EdgeInsets.symmetric(horizontal: 50),
                              child: Text(
                                "Hey there, welcome to my portfolio, my name is Antoine Gonthier, 18 years old, Epitech Student & Full-stack Flutter developer. I am passionate about developping cool graphical interface on application that i develop. I love developping server in order to create link between people innovate & learn new technologies.",
                                style: TextStyle(
                                  overflow: TextOverflow.visible,
                                  fontSize: 25,
                                  fontWeight: FontWeight.w300,
                                  letterSpacing: 0.96,
                                  color: Colors.white,
                                ),
                                textAlign: TextAlign.center,
                              ))),
                      const SizedBox(
                        height: 25,
                      ),
                      Container(
                        color: Colors.white,
                        height: 0.1,
                        width: MediaQuery.of(context).size.width,
                      ),
                      const SizedBox(
                        height: 35,
                      ),
                    ],
                  ),
                ),
              ];
            },
            body: Padding(
              padding: EdgeInsets.symmetric(
                  horizontal: MediaQuery.of(context).size.width / 20),
              child: ListView(
                children: [
                  Row(
                    mainAxisAlignment: MainAxisAlignment.start,
                    children: [
                      Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: const [
                          Text(
                            "📚 Education",
                            style: TextStyle(
                                color: Colors.white,
                                fontSize: 30,
                                fontWeight: FontWeight.w300),
                          ),
                        ],
                      ),
                    ],
                  ),
                  const Center(
                      child: Padding(
                          padding: EdgeInsets.symmetric(horizontal: 50),
                          child: Text(
                            "\n - 3 years of autodidact learn of mobile development\n - 1 year at programming college at Epitech Nantes, title aimed: BAC +5, Expert in Technology & Information",
                            style: TextStyle(
                              overflow: TextOverflow.visible,
                              fontSize: 25,
                              letterSpacing: 0.96,
                              fontWeight: FontWeight.w300,
                              color: Colors.white,
                            ),
                          ))),
                  Container(
                    height: 50,
                  ),
                  Row(
                      mainAxisAlignment: MainAxisAlignment.start,
                      children: const [
                        Text(
                          "🎨 Skills\n",
                          style: TextStyle(
                              color: Colors.white,
                              fontSize: 30,
                              fontWeight: FontWeight.w300),
                        ),
                      ]),
                  Image.network(
                      "https://skillicons.dev/icons?i=flutter,mongodb,express,firebase,nodejs,js,dart,mysql,ruby,docker"),
                  Container(
                    height: 10,
                  ),
                  Image.network(
                      "https://skillicons.dev/icons?i=html,css,swift,dart,graphql,git,github,supabase,kotlin,perl"),
                  Container(
                    height: 50,
                  ),
                  Row(
                      mainAxisAlignment: MainAxisAlignment.start,
                      children: const [
                        Text(
                          "🧭 Experience\n",
                          style: TextStyle(
                              color: Colors.white,
                              fontSize: 30,
                              fontWeight: FontWeight.w300),
                        ),
                      ]),
                  SizedBox(
                    height: 200,
                    child: CarouselSlider(
                        options: CarouselOptions(
                          autoPlay: true,
                          autoPlayInterval: const Duration(seconds: 3),
                          viewportFraction: 0.3,
                          aspectRatio: 2 / 10,
                          enlargeCenterPage: true,
                          onPageChanged: (index, reason) {
                            setState(() {});
                          },
                        ),
                        carouselController: _carouselController,
                        items: project.map((pro) {
                          return Builder(builder: (BuildContext context) {
                            return GestureDetector(
                                onTap: () {
                                  launchUrl(Uri.parse(pro["link"]));
                                },
                                child: ClipRRect(
                                    borderRadius: BorderRadius.circular(20),
                                    child: Container(
                                        color: const Color.fromARGB(
                                            255, 228, 228, 228),
                                        height: 30,
                                        width: 2000,
                                        child: Column(
                                          crossAxisAlignment:
                                              CrossAxisAlignment.center,
                                          children: [
                                            Container(
                                              height: 10,
                                            ),
                                            ClipRRect(
                                                borderRadius:
                                                    BorderRadius.circular(10),
                                                child: SizedBox(
                                                    height: 80,
                                                    width: 80,
                                                    child: Image.network(
                                                      pro["url"],
                                                      fit: BoxFit.cover,
                                                    ))),
                                            Container(
                                              height: 10,
                                            ),
                                            Text(
                                              pro["title"],
                                              style: const TextStyle(
                                                  fontWeight: FontWeight.w700,
                                                  color: Colors.black),
                                            ),
                                            Text(
                                              pro["description"],
                                              style: const TextStyle(
                                                  fontWeight: FontWeight.w500,
                                                  fontSize: 15,
                                                  color: Colors.black),
                                            ),
                                            Container(
                                              height: 10,
                                            ),
                                            SizedBox(
                                                width: pro["technos"]
                                                        .toString()
                                                        .split(",")
                                                        .toList()
                                                        .length
                                                        .toDouble() *
                                                    25,
                                                child: Image.network(
                                                  "https://skillicons.dev/icons?i=${pro["technos"]}",
                                                  fit: BoxFit.contain,
                                                ))
                                          ],
                                        ))));
                          });
                        }).toList()),
                  ),
                  Container(
                    height: 50,
                  ),
                  Row(
                      mainAxisAlignment: MainAxisAlignment.start,
                      children: const [
                        Text(
                          "🔗 Contact\n",
                          style: TextStyle(
                              color: Colors.white,
                              fontSize: 30,
                              fontWeight: FontWeight.w300),
                        ),
                      ]),
                  Row(
                    mainAxisAlignment: MainAxisAlignment.center,
                    children: [
                      GestureDetector(
                          onTap: () {
                            launchUrl(Uri.parse("https://google.com"));
                          },
                          child: const Icon(
                            FontAwesomeIcons.github,
                            color: Colors.white,
                            size: 60,
                          )),
                      const SizedBox(
                        width: 20,
                      ),
                      GestureDetector(
                          onTap: () {
                            launchUrl(Uri.parse(
                                "https://www.linkedin.com/in/antoine-gonthier-029a32242"));
                          },
                          child: const Icon(
                            FontAwesomeIcons.linkedin,
                            color: Colors.white,
                            size: 60,
                          )),
                      const SizedBox(
                        width: 20,
                      ),
                      GestureDetector(
                          onTap: () {
                            launchUrl(Uri.parse("https://medium.com/@zkhwctb"));
                          },
                          child: const Icon(
                            FontAwesomeIcons.medium,
                            color: Colors.white,
                            size: 60,
                          )),
                      const SizedBox(
                        width: 20,
                      ),
                      GestureDetector(
                          onTap: () {
                            launchUrl(Uri.parse(
                                "http://instagram.com/antoine.gtier/"));
                          },
                          child: const Icon(
                            FontAwesomeIcons.instagram,
                            color: Colors.white,
                            size: 60,
                          )),
                      const SizedBox(
                        width: 20,
                      ),
                      GestureDetector(
                          onTap: () {
                            launchUrl(Uri.parse(
                                "mailto:antoinegonthier11@icloud.com"));
                          },
                          child: const Icon(
                            Icons.mail,
                            color: Colors.white,
                            size: 70,
                          ))
                    ],
                  ),
                  Container(
                    height: 50,
                  ),
                  Container(
                    height: 5,
                    width: MediaQuery.of(context).size.width,
                    color: Colors.white,
                  ),
                  Padding(
                      padding: const EdgeInsets.symmetric(vertical: 5),
                      child: Text(
                        'Copyright © 2023 by Antoine Gonthier. All rights reserved.',
                        style: TextStyle(
                          fontFamily: 'Arial',
                          color: Colors.white,
                          fontSize: MediaQuery.of(context).size.width / 90,
                        ),
                      )),
                  Container(
                    height: 5,
                    width: MediaQuery.of(context).size.width,
                    color: Colors.white,
                  ),
                ],
              ),
            )));
  }
}
