import 'package:flutter_test/flutter_test.dart';
import 'package:portolio/main.dart';

void main() {
  testWidgets('Screenshot website', (WidgetTester tester) async {
    await tester.pumpWidget(const MyApp());
  });
}
