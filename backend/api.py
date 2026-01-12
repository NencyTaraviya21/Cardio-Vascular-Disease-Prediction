import pickle
import numpy as np
import pandas as pd
from fastapi import FastAPI
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class CardioData(BaseModel):
    age : int
    gender : int
    ap_hi : int
    ap_lo : int
    cholesterol	: int
    gluc : int
    smoke : int
    alco : int
    active: int
    bmi : float

# MinMax scaling parameters from training data (static)
# AGE_MIN = 29
# AGE_MAX = 64
# BMI_MIN = 3.47
# BMI_MAX = 298.67

# def minmax_scale(value, min_val, max_val):
#     return (value - min_val) / (max_val - min_val)

@app.post("/predict")
def predict(data : CardioData):
    with open('model.pickle', 'rb') as file:

        # # Scale age and BMI to [0, 1]
        # scaled_age = minmax_scale(data.age, AGE_MIN, AGE_MAX)
        # scaled_bmi = minmax_scale(data.bmi, BMI_MIN, BMI_MAX)
        
        # features = [
        #     data.age, 
        #     data.gender, 
        #     data.ap_hi, 
        #     data.ap_lo, 
        #     data.cholesterol, 
        #     data.gluc, 
        #     data.smoke,
        #     data.alco, 
        #     data.active, 
        #     data.bmi,
        # ]

        # final_input = np.array(features).reshape(1, -1)

        # print(f'Features : {features}')

        final_input = pd.DataFrame([{
            "age": data.age,
            "gender": data.gender,
            "ap_hi": data.ap_hi,
            "ap_lo": data.ap_lo,
            "cholesterol": data.cholesterol,
            "gluc": data.gluc,
            "smoke": data.smoke,
            "alco": data.alco,
            "active": data.active,
            "bmi": data.bmi
        }])
        model = pickle.load(file)
        print(f'Pred :  {model.predict(final_input)}')
        return {"Output" : int(model.predict(final_input)[0])}
