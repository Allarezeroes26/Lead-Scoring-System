import numpy as np
import pandas as pd
import json

np.random.seed(42)

df = pd.read_csv("bank.csv", sep=";")
df = df.drop(columns=["day"])

df = pd.get_dummies(df, columns=[
    "marital", "contact", "education",
    "poutcome", "job", "month"
])

cols = ["default", "housing", "loan", "y"]
for col in cols:
    df[col] = df[col].map({"yes": 1, "no": 0})

X = df.drop(columns=["y"]).values.astype(float)
y = df["y"].values

indices = np.random.permutation(len(X))
X = X[indices]
y = y[indices]

split = int(0.8 * len(X))
X_train, X_test = X[:split], X[split:]
y_train, y_test = y[:split], y[split:]

continuous_cols = ["age", "balance", "duration", "campaign", "pdays", "previous"]

feature_names = df.drop(columns=["y"]).columns
col_idx = [feature_names.get_loc(col) for col in continuous_cols]

mean = X_train[:, col_idx].mean(axis=0)
std = X_train[:, col_idx].std(axis=0)

std[std == 0] = 1

X_train[:, col_idx] = (X_train[:, col_idx] - mean) / std
X_test[:, col_idx] = (X_test[:, col_idx] - mean) / std


class LogisticRegression:

    def __init__(self, alpha=0.001, iterations=10000):
        self.alpha = alpha
        self.iterations = iterations
        self.w = None
        self.b = None

    def sigmoid(self, z):
        return 1 / (1 + np.exp(-z))

    def cost_function(self, X, y):
        z = np.dot(X, self.w) + self.b
        g = np.clip(self.sigmoid(z), 1e-15, 1 - 1e-15)

        cost = -np.mean(
            y * np.log(g) +
            (1 - y) * np.log(1 - g)
        )
        return cost

    def gradient(self, X, y):
        m = X.shape[0]

        z = np.dot(X, self.w) + self.b
        g = self.sigmoid(z)

        pos_weight = m / (np.sum(y) + 1e-15)
        neg_weight = m / (m - np.sum(y) + 1e-15)
    
        weights = np.where(y == 1, pos_weight, neg_weight)
    
        error = (g - y) * weights

        dw = (1 / m) * np.dot(X.T, error)
        db = (1 / m) * np.sum(error)

        return dw, db

    def fit(self, X, y):
        n = X.shape[1]

        self.w = np.zeros(n)
        self.b = 0

        for i in range(self.iterations):
            dw, db = self.gradient(X, y)

            self.w -= self.alpha * dw
            self.b -= self.alpha * db

            if i % 1000 == 0:
                print(f"Iteration {i}, Cost: {self.cost_function(X, y)}")

    def predict_proba(self, X):
        z = np.dot(X, self.w) + self.b
        return self.sigmoid(z)

    def predict(self, X, threshold=0.5):
        probs = self.predict_proba(X)
        return (probs >= threshold).astype(int)

    def evaluate(self, X, y, threshold=0.2):
        preds = self.predict(X, threshold)

        TP = np.sum((preds == 1) & (y == 1))
        TN = np.sum((preds == 0) & (y == 0))
        FP = np.sum((preds == 1) & (y == 0))
        FN = np.sum((preds == 0) & (y == 1))

        precision = TP / (TP + FP + 1e-15)
        recall = TP / (TP + FN + 1e-15)
        f1 = 2 * (precision * recall) / (precision + recall + 1e-15)

        accuracy = (TP + TN) / len(y)

        print("\nCONFUSION MATRIX:")
        print(f"TP: {TP}  TN: {TN}")
        print(f"FP: {FP}  FN: {FN}")

        print("\nMETRICS:")
        print(f"Accuracy: {accuracy:.4f}")
        print(f"Precision: {precision:.4f}")
        print(f"Recall: {recall:.4f}")
        print(f"F1 Score: {f1:.4f}")


if __name__ == "__main__":
    model = LogisticRegression(alpha=0.001, iterations=10000)
    model.fit(X_train, y_train)

    for t in np.arange(0.1, 0.9, 0.1):
        print(f"\nThreshold: {t}")
        model.evaluate(X_test, y_test, threshold=t)

    # Save artifacts
    np.save("weights.npy", model.w)
    np.save("bias.npy", model.b)

    np.save("mean.npy", mean)
    np.save("std.npy", std)

    np.save("col_idx.npy", np.array(col_idx))
    np.save("threshold.npy", np.array([0.6]))
    
    feature_names = df.drop(columns=["y"]).columns.tolist()

    with open("feature_names.json", "w") as f:
        json.dump(feature_names, f)

    with open("continuous_cols.json", "w") as f:
        json.dump(continuous_cols, f)