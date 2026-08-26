import os
import pandas as pd
import tensorflow as tf

from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler

# ==========================================
# Load Dataset
# ==========================================

DATASET_PATH = os.path.join(
    os.path.dirname(__file__),
    "..",
    "dataset",
    "dataset"
)

df = pd.read_csv(
    DATASET_PATH,
    sep=r"\s+",
    header=0
)

print("\n========== DATASET ==========")
print(df.head())

print("\n========== INFO ==========")
print(df.info())

print("\n========== MISSING VALUES ==========")
print(df.isnull().sum())

# ==========================================
# Remove Missing Values
# ==========================================

df = df.dropna()

print("\nDataset Shape After Cleaning:")
print(df.shape)

# Convert target to integer
df["target"] = df["target"].astype(int)

# ==========================================
# Features & Labels
# ==========================================

X = df.drop("target", axis=1)
y = df["target"]

# ==========================================
# Train Test Split
# ==========================================

X_train, X_test, y_train, y_test = train_test_split(
    X,
    y,
    test_size=0.2,
    random_state=42,
    stratify=y
)

# ==========================================
# Feature Scaling
# ==========================================

scaler = StandardScaler()

X_train = scaler.fit_transform(X_train)
X_test = scaler.transform(X_test)

# ==========================================
# Build Neural Network
# ==========================================

model = tf.keras.Sequential([
    tf.keras.layers.Input(shape=(X_train.shape[1],)),
    tf.keras.layers.Dense(64, activation="relu"),
    tf.keras.layers.Dense(32, activation="relu"),
    tf.keras.layers.Dense(16, activation="relu"),
    tf.keras.layers.Dense(1, activation="sigmoid")
])

model.compile(
    optimizer="adam",
    loss="binary_crossentropy",
    metrics=["accuracy"]
)

model.summary()

# ==========================================
# Train Model
# ==========================================

history = model.fit(
    X_train,
    y_train,
    validation_split=0.2,
    epochs=50,
    batch_size=16,
    verbose=1
)

# ==========================================
# Evaluate
# ==========================================

loss, accuracy = model.evaluate(X_test, y_test)

print("\n============================")
print("Test Accuracy :", accuracy)
print("Test Loss     :", loss)
print("============================")

# ==========================================
# Save Model
# ==========================================

MODEL_DIR = os.path.join(
    os.path.dirname(__file__),
    "..",
    "models"
)

os.makedirs(MODEL_DIR, exist_ok=True)

MODEL_PATH = os.path.join(
    MODEL_DIR,
    "heart_model.keras"
)

model.save(MODEL_PATH)

print("\nModel Saved Successfully!")
print("Saved At:", MODEL_PATH)