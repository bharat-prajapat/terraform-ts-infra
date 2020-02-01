# terraform-ts-infra

A clean and modern **Infrastructure as Code (IaC)** project using **Terraform** and **TypeScript** via the [CDK for Terraform (CDKTF)](https://developer.hashicorp.com/terraform/cdktf).

This repo showcases a sample AWS setup including:
- ✅ S3 Bucket
- ✅ DynamoDB Table
- ✅ Lambda Function with IAM Role

---

## 🔧 Tech Stack
- **Terraform**
- **CDK for Terraform (CDKTF)**
- **TypeScript**
- **AWS** (S3, Lambda, DynamoDB, IAM)

---

## 📁 Project Structure
```bash
terraform-ts-infra/
├── main.ts                # CDKTF stack definition
├── lambda/
│   ├── index.js          # Lambda source code
│   └── lambda.zip        # Zipped code for deployment
├── cdktf.json            # CDKTF project config
├── .gitignore            # Ignore files
└── README.md             # Project documentation
```

---

## 🚀 Getting Started

### 1. Install Dependencies
```bash
npm install --save cdktf @cdktf/provider-aws constructs
```

### 2. Initialize CDKTF (if not already)
```bash
cdktf init --template=typescript --local
```

### 3. Create Lambda Code and Zip
```bash
mkdir -p lambda
# Create Lambda handler
cat <<EOF > lambda/index.js
exports.handler = async () => ({
  statusCode: 200,
  body: 'Hello from Lambda'
});
EOF
cd lambda && zip lambda.zip index.js && cd ..
```

### 4. Synthesize and Deploy
```bash
cdktf get
cdktf deploy
```

---

## 🧱 Resources Created
- `aws_s3_bucket`
- `aws_dynamodb_table`
- `aws_lambda_function`
- `aws_iam_role` + `aws_iam_role_policy_attachment`

---

## 📜 License
[MIT License](LICENSE)

---

## 🌐 Author
**Bharat Prajapat**  

---

> You are welcome to fork this repo, contribute, or use it as a template for your own infrastructure code!
