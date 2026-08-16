import 'package:flutter/material.dart';

import 'src/screens/home_screen.dart';

void main() {
  runApp(const JigsawPuzzleApp());
}

class JigsawPuzzleApp extends StatelessWidget {
  const JigsawPuzzleApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: '직소 퍼즐',
      theme: ThemeData(
        colorScheme: ColorScheme.fromSeed(seedColor: Colors.indigo),
        useMaterial3: true,
      ),
      home: const HomeScreen(),
    );
  }
}
