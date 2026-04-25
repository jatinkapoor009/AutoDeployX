pipeline {
    agent any

    triggers {
        githubPush()
    }

    environment {
        STAGING_FILE = "docker-compose.staging.yml"
        PROD_FILE = "docker-compose.prod.yml"

        DOCKER_USER = "jatink9599"
        IMAGE_BACKEND = "autodeployx-backend"
    }

    stages {

        stage('Checkout Code') {
            steps {
                git branch: 'main', url: 'https://github.com/jatinkapoor009/AutoDeployX.git'
            }
        }

        stage('Build Backend Image') {
            steps {
                echo 'Building Backend Docker Image...'
                sh 'docker compose -f ${STAGING_FILE} build backend'
            }
        }

        stage('DockerHub Login') {
            steps {
                withCredentials([usernamePassword(
                    credentialsId: 'dockerhub-creds',
                    usernameVariable: 'USER',
                    passwordVariable: 'PASS'
                )]) {
                    sh 'echo $PASS | docker login -u $USER --password-stdin'
                }
            }
        }

        stage('Tag & Push Backend Image') {
            steps {
                sh '''
                docker tag autodeployx_backend_staging $DOCKER_USER/$IMAGE_BACKEND:latest
                docker push $DOCKER_USER/$IMAGE_BACKEND:latest
                '''
            }
        }

        stage('Deploy to Staging') {
            steps {
                echo 'Deploying to STAGING...'
                sh '''
                docker compose -p staging -f ${STAGING_FILE} down --remove-orphans || true
                docker compose -p staging -f ${STAGING_FILE} up -d --build
                '''
            }
        }

        stage('Staging Test') {
            steps {
                echo 'Checking staging containers...'
                sleep 10
                sh 'docker ps'
            }
        }

        stage('Approval') {
            steps {
                input message: 'Deploy to PRODUCTION?', ok: 'Yes Deploy'
            }
        }

        stage('Deploy to Production') {
            steps {
                echo 'Deploying to PRODUCTION...'
                sh '''
                docker compose -p prod -f ${PROD_FILE} up -d --build
                '''
            }
        }

        stage('Production Test') {
            steps {
                echo 'Checking production containers...'
                sleep 10
                sh 'docker ps'
            }
        }
    }

    post {
        success {
            echo '🚀 Deployment Successful (Staging + Production)'
        }
        failure {
            echo '❌ Pipeline Failed'
        }
    }
}
