int buttonPin = 2;
bool button;
  
void setup() {
  pinMode(buttonPin, INPUT);
  Serial.begin(9600);
}

void loop() {
  int pot = analogRead(A0);
  int test = 23;
  if(digitalRead(buttonPin) == HIGH) {
    button = false;
  } else {
    button = true;
  }
  Serial.println(String(pot) + " " + String(button)); // <35-800ish> <0 or 1>
  delay(5); // for stability
}
