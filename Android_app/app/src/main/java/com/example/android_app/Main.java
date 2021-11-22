package com.example.android_app;

import android.os.Bundle;
import android.view.View;
import android.widget.Button;
import android.widget.CompoundButton;
import android.widget.EditText;
import android.widget.RadioButton;
import android.widget.RadioGroup;
import android.widget.Toast;

import androidx.annotation.Nullable;
import androidx.appcompat.app.AppCompatActivity;

public class Main extends AppCompatActivity {

    Button Add;
    EditText Reporter,Address,Rent,Furniture,Date;
    RadioGroup RadioType,RadioBedroom;


    @Override
    protected void onCreate(@Nullable Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);

        Add = findViewById(R.id.btn);
        RadioType = findViewById(R.id.radioGroup1);
        RadioBedroom = findViewById(R.id.radioGroup2);

        Address = findViewById(R.id.inputAddress);
        Furniture = findViewById(R.id.inputFurniture);
        Rent = findViewById(R.id.inputRent);
        Reporter = findViewById(R.id.inputReporter);
        Date = findViewById(R.id.inputDate);

        Add.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {

                String date = Date.getText().toString();
                String price = Rent.getText().toString();
                String furniture = Furniture.getText().toString();
                String reporter = Reporter.getText().toString();
                String address = Address.getText().toString();
                Boolean Ischeck = true;

                if(date.length()==0){
                    Date.setError("Date is required!");
                    Ischeck = false;
                }
                if(price.length()==0){
                    Rent.setError("Rent is required!");
                    Ischeck = false;
                }
                if(price.length()==0){
                    Rent.setError("Rent is required!");
                    Ischeck = false;
                }
                if(furniture.length() == 0){
                    Furniture.setError("Furniture is required!");
                    Ischeck = false;
                }
                if(reporter.length() == 0) {
                    Reporter.setError("Reporter is required!");
                    Ischeck = false;
                }
                if(address.length() == 0) {
                    Address.setError("Address is required!");
                    Ischeck = false;
                }

                if(Ischeck){
                    Toast.makeText(Main.this, "Add successfulc", Toast.LENGTH_SHORT).show();
                }

            }
        });
    }
}
