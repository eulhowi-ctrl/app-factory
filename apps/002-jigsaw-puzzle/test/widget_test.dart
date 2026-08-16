import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';

import 'package:jigsaw_puzzle/main.dart';

void main() {
  testWidgets('홈 화면이 이미지/난이도 선택 UI를 보여준다', (WidgetTester tester) async {
    await tester.pumpWidget(const JigsawPuzzleApp());

    expect(find.text('직소 퍼즐'), findsOneWidget);
    expect(find.text('이미지 선택'), findsOneWidget);
    expect(find.text('난이도 선택'), findsOneWidget);
    expect(find.text('퍼즐 시작'), findsOneWidget);
  });

  testWidgets('난이도 선택 시 ChoiceChip 상태가 바뀐다', (WidgetTester tester) async {
    await tester.pumpWidget(const JigsawPuzzleApp());

    final hardChip = find.widgetWithText(ChoiceChip, '어려움 (96피스)');
    expect(hardChip, findsOneWidget);
    await tester.ensureVisible(hardChip);
    await tester.pumpAndSettle();

    await tester.tap(hardChip);
    await tester.pump();

    final chipWidget = tester.widget<ChoiceChip>(hardChip);
    expect(chipWidget.selected, isTrue);
  });
}
