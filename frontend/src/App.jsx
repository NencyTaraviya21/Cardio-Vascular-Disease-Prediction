
import { useState, useEffect } from "react";
import axios from "axios";
import "./App.css"

import {
  Activity,
  Heart,
  Lock,
  Zap,
  AlertCircle,
  CheckCircle,
  Stethoscope,
  Users,
} from "lucide-react";
import CustomSelect from "./components/CustomSelect";
import "./app.css";

export default function App() {
  const [theme, setTheme] = useState("light");

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === "light" ? "dark" : "light"));
  };

  const [formData, setFormData] = useState({
    age: "",
    gender: "1",
    ap_hi: "",
    ap_lo: "",
    cholesterol: "1",
    gluc: "1",
    smoke: "0",
    alco: "0",
    active: "1",
    bmi: "",
  });

  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const mapApHi = (val) => {
    const v = Number.parseInt(val);
    if (v < 130) return 1;
    if (v >= 130 && v <= 139) return 2;
    if (v >= 140 && v < 180) return 3;
    if (v >= 180) return 4;
    return 1;
  };

  const mapApLo = (val) => {
    const v = Number.parseInt(val);
    if (v < 85) return 1;
    if (v >= 85 && v <= 89) return 2;
    if (v >= 90 && v <= 99) return 3;
    if (v > 99) return 4;
    return 1;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const payload = {
        age: Number.parseInt(formData.age),
        gender: Number.parseInt(formData.gender),
        ap_hi: mapApHi(formData.ap_hi),
        ap_lo: mapApLo(formData.ap_lo),
        cholesterol: Number.parseInt(formData.cholesterol),
        gluc: Number.parseInt(formData.gluc),
        smoke: Number.parseInt(formData.smoke),
        alco: Number.parseInt(formData.alco),
        active: Number.parseInt(formData.active),
        bmi: Number.parseFloat(formData.bmi),
      };

      console.log("Sending payload:", payload);

      const response = await axios.post(
        "https://cardio-ml-824l.onrender.com/predict",
        payload
      );

      console.log("Response received:", response.data);
      setResult(response.data.Output);
    } catch (err) {
      console.error("Error details:", err.response?.data || err.message);
      setError(
        err.response?.data?.error ||
          "Failed to get prediction. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app-wrapper">
      <header className="navbar-custom">
        <div className="container-fluid">
          <div className="navbar-content">
            <h1 className="navbar-brand">CardioPredictor</h1>
            {/* <button onClick={toggleTheme} className="btn-theme-toggle" aria-label="Toggle theme">
              {theme === "light" ? "🌙" : "☀️"}
            </button> */}
          </div>
        </div>
      </header>

      <main className="main-content">
        {/* Hero Section */}
        <section className="hero">
          <div className="container">
            <div className="text-center hero-inner">
              <div className="hero-icon">
                <Heart size={56} />
              </div>
              <h1 className="hero-title">Cardiovascular Risk Assessment</h1>
              <p className="hero-subtitle">
                Leveraging advanced algorithms to predict your cardiovascular
                disease risk based on medical data
              </p>
            </div>
          </div>
        </section>

        <section className="form-section">
          <div className="container">
            <div className="card card-form">
              <div className="card-header">
                <h2 className="card-title">Your Health Profile</h2>
                <p className="card-subtitle">
                  Enter your health information to receive a risk assessment
                </p>
              </div>
              <div className="card-body">
                <form onSubmit={handleSubmit} className="form-layout">
                  {/* Row 1: Age & Gender */}
                  <div className="form-row">
                    <div className="form-group">
                      <label htmlFor="age" className="form-label">
                        Age (years)
                      </label>
                      <input
                        type="number"
                        id="age"
                        name="age"
                        value={formData.age}
                        onChange={handleChange}
                        placeholder="30"
                        required
                        className="form-control"
                      />
                    </div>
                    <div className="form-group">
                      <label htmlFor="gender" className="form-label">
                        Gender
                      </label>
                      <CustomSelect
                        name="gender"
                        value={formData.gender}
                        onChange={handleChange}
                        options={[
                          { value: "1", label: "Female" },
                          { value: "2", label: "Male" },
                        ]}
                        className="form-select"
                      />
                    </div>
                  </div>

                  {/* Row 2: Blood Pressure */}
                  <div className="form-row">
                    <div className="form-group">
                      <label htmlFor="ap_hi" className="form-label">
                        Systolic BP (mmHg)
                      </label>
                      <input
                        type="number"
                        id="ap_hi"
                        name="ap_hi"
                        value={formData.ap_hi}
                        onChange={handleChange}
                        placeholder="120"
                        required
                        className="form-control"
                      />
                    </div>
                    <div className="form-group">
                      <label htmlFor="ap_lo" className="form-label">
                        Diastolic BP (mmHg)
                      </label>
                      <input
                        type="number"
                        id="ap_lo"
                        name="ap_lo"
                        value={formData.ap_lo}
                        onChange={handleChange}
                        placeholder="80"
                        required
                        className="form-control"
                      />
                    </div>
                  </div>

                  {/* Row 3: BMI & Cholesterol */}
                  <div className="form-row">
                    <div className="form-group">
                      <label htmlFor="bmi" className="form-label">
                        BMI (kg/m²)
                      </label>
                      <input
                        type="number"
                        id="bmi"
                        name="bmi"
                        step="0.1"
                        value={formData.bmi}
                        onChange={handleChange}
                        placeholder="24.5"
                        required
                        className="form-control"
                      />
                    </div>
                    <div className="form-group">
                      <label htmlFor="cholesterol" className="form-label">
                        Cholesterol Level
                      </label>
                      <CustomSelect
                        name="cholesterol"
                        value={formData.cholesterol}
                        onChange={handleChange}
                        options={[
                          { value: "1", label: "Normal" },
                          { value: "2", label: "Above Normal" },
                          { value: "3", label: "Well Above Normal" },
                        ]}
                        className="form-select"
                      />
                    </div>
                  </div>

                  {/* Row 4: Glucose & Lifestyle */}
                  <div className="form-row">
                    <div className="form-group">
                      <label htmlFor="gluc" className="form-label">
                        Glucose Level
                      </label>
                      <CustomSelect
                        name="gluc"
                        value={formData.gluc}
                        onChange={handleChange}
                        options={[
                          { value: "1", label: "Normal" },
                          { value: "2", label: "Above Normal" },
                          { value: "3", label: "Well Above Normal" },
                        ]}
                        className="form-select"
                      />
                    </div>
                    <div className="form-group">
                      <label htmlFor="active" className="form-label">
                        Physical Activity
                      </label>
                      <CustomSelect
                        name="active"
                        value={formData.active}
                        onChange={handleChange}
                        options={[
                          { value: "0", label: "No" },
                          { value: "1", label: "Yes" },
                        ]}
                        className="form-select"
                      />
                    </div>
                  </div>

                  {/* Row 5: Smoking & Alcohol */}
                  <div className="form-row">
                    <div className="form-group">
                      <label htmlFor="smoke" className="form-label">
                        Smoker
                      </label>
                      <CustomSelect
                        name="smoke"
                        value={formData.smoke}
                        onChange={handleChange}
                        options={[
                          { value: "0", label: "No" },
                          { value: "1", label: "Yes" },
                        ]}
                        className="form-select"
                      />
                    </div>
                    <div className="form-group">
                      <label htmlFor="alco" className="form-label">
                        Alcohol Consumption
                      </label>
                      <CustomSelect
                        name="alco"
                        value={formData.alco}
                        onChange={handleChange}
                        options={[
                          { value: "0", label: "No" },
                          { value: "1", label: "Yes" },
                        ]}
                        className="form-select"
                      />
                    </div>
                  </div>

                  {/* Submit button */}
                  <button
                    type="submit"
                    className="btn btn-primary btn-submit"
                    disabled={loading}
                  >
                    {loading ? "Analyzing..." : "Get Risk Assessment"}
                  </button>
                </form>

                {/* Error alert */}
                {error && (
                  <div
                    className="alert alert-danger alert-dismissible fade show"
                    role="alert"
                  >
                    <AlertCircle size={20} className="alert-icon" />
                    <span>{error}</span>
                  </div>
                )}

                {/* Result display */}
                {result !== null && (
                  <div
                    className={`result-alert ${
                      result === 1 ? "alert-high-risk" : "alert-low-risk"
                    }`}
                  >
                    <div className="result-header">
                      {result === 1 ? (
                        <>
                          <AlertCircle size={32} className="result-icon" />
                          <h3 className="result-title">High Risk</h3>
                        </>
                      ) : (
                        <>
                          <CheckCircle size={32} className="result-icon" />
                          <h3 className="result-title">Low Risk</h3>
                        </>
                      )}
                    </div>

                    <p className="result-text">
                      {result === 1
                        ? "Our analysis suggests an increased cardiovascular risk. Please consult with a healthcare professional for personalized advice."
                        : "Our analysis suggests a lower cardiovascular risk. Continue maintaining healthy habits."}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="features-section">
          <div className="container">
            <h2 className="section-title text-center mb-5">
              Why Choose CardioPredictor?
            </h2>
            <div className="row g-4">
              <div className="col-md-6 col-lg-4">
                <div className="card card-feature">
                  <div className="card-body text-center">
                    <div className="feature-icon">
                      <Zap size={32} />
                    </div>
                    <h5 className="card-title">AI-Powered</h5>
                    <p className="card-text text-muted">
                      Advanced machine learning for accurate predictions
                    </p>
                  </div>
                </div>
              </div>
              <div className="col-md-6 col-lg-4">
                <div className="card card-feature">
                  <div className="card-body text-center">
                    <div className="feature-icon">
                      <Lock size={32} />
                    </div>
                    <h5 className="card-title">Privacy First</h5>
                    <p className="card-text text-muted">
                      Your data is never stored or shared
                    </p>
                  </div>
                </div>
              </div>
              <div className="col-md-6 col-lg-4">
                <div className="card card-feature">
                  <div className="card-body text-center">
                    <div className="feature-icon">
                      <Activity size={32} />
                    </div>
                    <h5 className="card-title">Instant Results</h5>
                    <p className="card-text text-muted">
                      Get predictions in seconds
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Info Cards Section */}
        <section className="info-section">
          <div className="container">
            <div className="row g-4">
              <div className="col-md-6 col-lg-3">
                <div className="card card-info">
                  <div className="card-body">
                    <div className="info-icon-box">
                      <Stethoscope size={24} />
                    </div>
                    <h5 className="card-title">What This Tool Does</h5>
                    <p className="card-text text-muted">
                      This tool analyzes your health data and uses a trained
                      machine learning model to estimate your cardiovascular
                      disease risk on a scale of 0 to 1.
                    </p>
                  </div>
                </div>
              </div>

              <div className="col-md-6 col-lg-3">
                <div className="card card-info">
                  <div className="card-body">
                    <div className="info-icon-box">
                      <Activity size={24} />
                    </div>
                    <h5 className="card-title">How It Works</h5>
                    <p className="card-text text-muted">
                      The prediction is based on clinically relevant factors
                      including age, blood pressure, BMI, cholesterol levels,
                      glucose levels, and lifestyle habits.
                    </p>
                  </div>
                </div>
              </div>

              <div className="col-md-6 col-lg-3">
                <div className="card card-info">
                  <div className="card-body">
                    <div className="info-icon-box">
                      <Users size={24} />
                    </div>
                    <h5 className="card-title">Who Should Use It</h5>
                    <p className="card-text text-muted">
                      This tool is designed for adults interested in
                      understanding their cardiovascular health risk based on
                      standard health metrics.
                    </p>
                  </div>
                </div>
              </div>

              <div className="col-md-6 col-lg-3">
                <div className="card card-info">
                  <div className="card-body">
                    <div className="info-icon-box">
                      <AlertCircle size={24} />
                    </div>
                    <h5 className="card-title">Important Disclaimer</h5>
                    <p className="card-text text-muted">
                      This tool is for educational purposes only and should not
                      replace professional medical advice. Always consult with a
                      qualified healthcare provider.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="footer">
        <div className="container">
          <p className="text-muted">
            &copy; 2025 CardioPredictor. Educational tool for cardiovascular
            risk assessment.
          </p>
        </div>
      </footer>
    </div>
  );
}
