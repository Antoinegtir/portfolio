import 'package:cached_network_image/cached_network_image.dart';
import 'package:flutter/material.dart';
import 'package:flutter/src/widgets/container.dart';
import 'package:flutter/src/widgets/framework.dart';

class ProjectPage extends StatefulWidget {
  ProjectPage({required this.data, super.key});
  Map<String, dynamic> data;
  @override
  State<ProjectPage> createState() => _ProjectPageState();
}

class _ProjectPageState extends State<ProjectPage> {
  @override
  Widget build(BuildContext context) {
    return Scaffold(
        appBar: AppBar(),
        body: Column(
          children: [
            Hero(
                tag: "logo",
                child: ClipRRect(
                    borderRadius: BorderRadius.circular(10),
                    child: SizedBox(
                        height: 200,
                        width: 200,
                        child: CachedNetworkImage(
                          imageUrl: widget.data["url"],
                          fit: BoxFit.cover,
                        )))),
          ],
        ));
  }
}
