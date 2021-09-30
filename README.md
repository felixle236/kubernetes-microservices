# Kubernetes Microservices
This project will present how do the microservices work and how to deploy the microservices on Kubernetes.
Google Kubernetes Engine (GKE) is used as infrastructure for this project.

## Required
- Knowledge of Kubernetes and microservices architecture.

## kubectl Cheat Sheet
https://github.com/dennyzhang/cheatsheet-kubernetes-A4
https://kubernetes.io/vi/docs/reference/kubectl/cheatsheet

## Architecture Diagrams
![Microservices Architecture](https://github.com/felixle236/kubernetes-microservices/blob/master/diagrams/microservices-architecture.jpg)
![Microservices Communication](https://github.com/felixle236/kubernetes-microservices/blob/master/diagrams/microservices-communication.jpg)

## Get Started
### 1. Google Kubernetes Engine
- Create Google account.
- Enable Kubernetes Engine.
- Create Kubernetes Cluster.
- Refer to https://cloud.google.com/kubernetes-engine/docs/quickstart

### 2. Install & Initialize the Cloud SDK
- To initialize the Cloud SDK `gcloud init` and kubectl `gcloud components install kubectl`.
- To list accounts whose credentials are stored on the local system `gcloud auth list`.
- Switch project: `gcloud config set project <project_name>`.
- After creating your cluster, you need to get authentication credentials to interact with the cluster: `gcloud container clusters get-credentials <cluster_name>`.
- Refer to https://cloud.google.com/sdk/docs/quickstart

### 3. Create storage class for ssd
- `kubectl apply -f infrastructure/general/kubernetes/storage-class.yaml`.

### 4. Initialize namespaces/environments
- We will use the namespace for each environment.
- Create namespace by command: `kubectl apply -f infrastructure/environments/development/namespace.yaml` or `kubectl create namespace dev`.

### 5. Create Nginx Ingress Controller:
- Add nginx-stable helm chart: `helm repo add ingress-nginx https://kubernetes.github.io/ingress-nginx && helm repo update`.
- Create Nginx Ingress Controller for each environment: `helm install <ingress_name>-<env> ingress-nginx/ingress-nginx -n <env>`. For example: `helm install nginx-ingress-dev ingress-nginx/ingress-nginx -n dev`.
- Or create Nginx Ingress Controller with IP address has exists: `helm install <ingress_name>-<env> ingress-nginx/ingress-nginx --set controller.service.loadBalancerIP="<ip_address>" -n <env>`.
- Refer to:
  + https://cloud.google.com/community/tutorials/nginx-ingress-gke
  + https://docs.nginx.com/nginx-ingress-controller/installation/installation-with-helm

### 6. Deploy message broker
- RabbitMQ will be used as the message broker for this system. Microservices will communicate together via RabbitMQ also.
- Add helm repository: `helm repo add bitnami https://charts.bitnami.com/bitnami`.
- Apply the secret first `kubectl apply -f infrastructure/environments/<env>/general/rabbitmq/secret.yaml`.
- Install the helm chart with a yaml file and environment: `helm install rabbitmq -f infrastructure/general/rabbitmq/values.yaml --set auth.existingPasswordSecret=rabbitmq-secret bitnami/postgresql -n <env>`.
- RabbitMQ can be accessed via DNS name from within your cluster: `rabbitmq.<env>.svc.cluster.local`.
- Uninstall the helm chart: `helm delete rabbitmq -n <env>`.
- Refer to https://github.com/bitnami/charts/tree/master/bitnami/rabbitmq

### 7. Deploy database
- We are using PostgreSQL helm chart for all microservices and we will use the same command for each service.
- Need to create storage class for ssd first because we use ssd storage for database.
- Add helm repository: `helm repo add bitnami https://charts.bitnami.com/bitnami`.
- Apply the secret first `kubectl apply -f infrastructure/environments/<env>/account-service/db/secret.yaml`, the same with other services.
- Install the helm chart with a yaml file and environment: `helm install account-db -f infrastructure/general/postgresql/values.yaml --set global.postgresql.existingSecret=account-db-secret bitnami/postgresql -n <env>`, the same with other services.
- PostgreSQL can be accessed via port 5432 on the following DNS names from within your cluster:
  + `account-db-postgresql.<env>.svc.cluster.local` for read/write connection.
  + `account-db-postgresql-read.<env>.svc.cluster.local` for read-only connection.
- Uninstall the helm chart: `helm delete account-db -n <env>`.
- Refer to https://github.com/bitnami/charts/tree/master/bitnami/postgresql

- To access to disk for downloading the data of database, we need to update `gcePersistentDisk.pdName` to disk name into `infrastructure/general/kubernetes/access-pvc.yaml` and apply it, then we can download database with command: `kubectl cp access-pvc-pod:/bitnami/postgresql/data ./data`.
- Deploy PgAdmin to access and manage databases:
  + Apply secret: `kubectl apply -f infrastructure/environments/<env>/general/pgadmin/secret.yaml`.
  + Apply PVC: `kubectl apply -f infrastructure/general/pgadmin/pvc.yaml -n <env>`.
  + Apply deployment: `kubectl apply -f infrastructure/general/pgadmin/deployment.yaml -n <env>`.
  + Apply service: `kubectl apply -f infrastructure/general/pgadmin/service.yaml -n <env>`.
  + Apply ingress: `kubectl apply -f infrastructure/environments/<env>/general/pgadmin/ingress.yaml`.

### 8. Deploy caching database
- We are using Redis for all microservices that we want to use data caching, we will apply the same command for each service.
- Need to create storage class for ssd first because we use ssd storage for data caching.
- Add helm repository: `helm repo add bitnami https://charts.bitnami.com/bitnami`.
- Apply the secret first `kubectl apply -f infrastructure/environments/<env>/account-service/db-caching/secret.yaml`.
- Install the helm chart with a yaml file and environment: `helm install account-db-caching -f infrastructure/general/redis/values.yaml --set auth.existingSecret=account-db-socket-secret bitnami/redis -n <env>`.
- Redis can be accessed via port 6379 on the following DNS names from within your cluster:
  + `account-db-caching-redis-master.<env>.svc.cluster.local` for read/write connection.
  + `account-db-caching-redis-slave.<env>.svc.cluster.local` for read-only connection.
- Uninstall the helm chart: `helm delete account-db-caching -n <env>`.
- Refer to https://github.com/bitnami/charts/tree/master/bitnami/redis

### 9. Deploy socket database
- We are using Redis for all microservices that we want to use socket, we will apply the same command for each service (for this demo, we are using socket in `chat-service` and `notification-service`).
- Need to create storage class for ssd first because we use ssd storage for socket.
- Add helm repository: `helm repo add bitnami https://charts.bitnami.com/bitnami`.
- Apply the secret first `kubectl apply -f infrastructure/environments/<env>/chat-service/db-socket/secret.yaml`.
- Install the helm chart with a yaml file and namespace: `helm install chat-db-socket -f infrastructure/general/redis/values.yaml --set auth.existingSecret=chat-db-socket-secret bitnami/redis -n <env>`.
- Redis can be accessed via port 6379 on the following DNS names from within your cluster:
  + `chat-db-socket-redis-master.<env>.svc.cluster.local` for read/write connection.
  + `chat-db-socket-redis-slave.<env>.svc.cluster.local` for read-only connection.
- Uninstall the helm chart: `helm delete chat-db-socket -n <env>`.
- Refer to https://github.com/bitnami/charts/tree/master/bitnami/redis

### 10. Deploy services
- For all services, we are using [node-core](https://github.com/felixle236/node-core) framework that it built on NodeJS.
- Build your services to docker images and push them to your docker repositories as docker hub. For example: `felixle236/k8s-micro-account-service`.
- Create docker repository must include environment and tag. For production example: `felixle236/k8s-micro-account-service-prod:1.0.0`, with other environments we can use version build of pipeline for tag as `felixle236/k8s-micro-account-service-dev:12`.
- To access private registry (to pull docker image), we have to create docker register secret with:
  + `kubectl create secret docker-registry <secret_name> --docker-server=<your_registry_server> --docker-username=<your_name> --docker-password=<your_pword> --docker-email=<your_email> -n <env>`.
  + Or `kubectl apply -f infrastructure/general/kubernetes/docker-secret.yaml -n <env>`.
- `initContainers` configuration is used for migration.
- Make sure that database have created.
- Apply secret: `kubectl apply -f infrastructure/environments/<env>/account-service/service/secret.yaml`.
- Apply deployment: `kubectl apply -f infrastructure/account-service/service/deployment.yaml -n <env>`.
- Apply service: `kubectl apply -f infrastructure/account-service/service/service.yaml -n <env>`.
- Apply ingress: `kubectl apply -f infrastructure/environments/<env>/account-service/service/ingress.yaml`.

## Others
### Mount the environment files from secret
- Encode base64 for the value: `echo -n '<secret_value>' | base64`.
- Encode base64 for the file: `base64 <file_name> | tr -d '\n\r' > <new_file_name>`.
- Decode base64 for the value: `echo -n '<secret_value>' | base64 --decode`.
- Decode base64 for the file: `base64 --decode <file_name> > <new_file_name>`.
- Refer to https://kubernetes.io/docs/concepts/configuration/secret/

### Separate Environment with Taints and Tolerations
- To add a taint to a node: `kubectl taint nodes <node_name> service=account-db:NoSchedule` or `kubectl taint nodes <node_name> database=true:NoSchedule`.
- To remove the taint added: `kubectl taint nodes <node_name> service=account-db:NoSchedule-`.
- Refer to https://kubernetes.io/docs/concepts/scheduling-eviction/taint-and-toleration/
> If we have installed any helm app, we must to double check and update the tolerations for them.

### Access to container in Kubernetes cluster
- Set current namespace first (`kubectl config set-context --current --namespace=<namespace>`) or use param `-n <namespace>`. Use `bash` or `sh` command, it depend on your container.
- Access directly to container: `kubectl exec -it <pod_name> -c <container_name> bash -n <namespace>`.
- Access to computer instance: `gcloud compute instances list` & `gcloud compute ssh <instance_name> [--zone=<instance_zone>]`, after that we can access to container docker command: `sudo docker ps -a` & `sudo docker exec -it <container_id> bash`.

### Setup auto deployment pipelines
- https://kubernetes.io/docs/concepts/workloads/controllers/deployment/#updating-a-deployment
- https://cloud.google.com/blog/products/application-development/automated-deployment-pipelines-come-to-gke
