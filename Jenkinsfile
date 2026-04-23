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
IMAGE_NGINX = "autodeployx-nginx"


}

stages {

stage('Checkout Code') {
    steps {
        git branch: 'main', url: 'https://github.com/jatinkapoor009/AutoDeployX.git'
    }
}

stage('Build Images') {
    steps {
        echo 'Building Docker images...'
        sh 'docker-compose -f ${STAGING_FILE} build'
    }
}

stage('Cleanup Old Containers') {
    steps {
        echo 'Cleaning old containers (safe cleanup)...'
        sh '''
        docker-compose -p staging -f ${STAGING_FILE} down --remove-orphans || true
        docker-compose -p prod -f ${PROD_FILE} down --remove-orphans || true
        '''
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

stage('Tag Images') {
    steps {
        sh 'docker tag autodeployx_backend_prod $DOCKER_USER/$IMAGE_BACKEND:latest'
        sh 'docker tag autodeployx-pipeline_nginx $DOCKER_USER/$IMAGE_NGINX:latest'
    }
}

stage('Push to DockerHub') {
    steps {
        sh 'docker push $DOCKER_USER/$IMAGE_BACKEND:latest'
        sh 'docker push $DOCKER_USER/$IMAGE_NGINX:latest'
    }
}

stage('Deploy to Staging') {
    steps {
        echo 'Deploying to STAGING...'
        sh '''
        docker-compose -p staging -f ${STAGING_FILE} up -d
        '''
    }
}

stage('Staging Test') {
    steps {
        echo 'Checking staging app...'
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
        docker-compose -p prod -f ${PROD_FILE} up -d
        '''
    }
}

stage('Production Test') {
    steps {
        echo 'Checking production app...'
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

