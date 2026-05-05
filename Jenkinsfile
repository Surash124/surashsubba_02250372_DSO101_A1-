pipeline {
  agent any
  tools {
    nodejs 'NodeJS'
  }
  stages {

    stage('Checkout') {
      steps {
        git branch: 'main',
            url: 'https://github.com/Surash124/surashsubba_02250372_DSO101_A1-.git'
      }
    }

    stage('Install') {
      steps {
        dir('todo-app/backend') {
          sh 'npm install'
        }
      }
    }

    stage('Test') {
      steps {
        dir('todo-app/backend') {
          sh 'npm test'
        }
      }
      post {
        always {
          junit 'todo-app/backend/junit.xml'
        }
      }
    }

    stage('Deploy') {
      steps {
        script {
          docker.build('surashsubba/be-todo:latest')
          docker.withRegistry('https://registry.hub.docker.com', 'docker-hub-creds') {
            docker.image('surashsubba/be-todo:latest').push()
          }
        }
      }
    }

  }
}