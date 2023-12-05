# Install Rancher Desktop
`brew install rancher`

# Copy Kube Config to Workstation
`cat ~/.kube/config`

# Instal Helm
`brew install helm`

# Create MongoDB
`kubectl apply -f mongodb.yaml`

# Create Postgres DB
`kubectl apply -f postgres.yaml`

# Configure Rancher Desktop
- Preferences
    - Application -> Behavior
        - Automatically start at login
        - Start in the background
    - Virtual Machine -> Hardware
        - Memory 4GB
        - \# CPUs 2
    - Container Engine -> General
        - dockerd
    - Kubernetes
        - Enable Kubernetes
        - v1.27.7 (Stable)
        - Enable Traefik (Uncheck)

# Local Docker Registry 
`docker run -d -p 5000:5000 --restart=always --name=comtilyhub registry`

# Create Persistent Storage
`kubectl apply -f persistenvolumeclaims.yaml`

# Create Docker for Not Scrap Yet
```
/Users/geryonghost/gitrepos/notscrapyet/app
docker build --tag localhost:5000/not-scrap-yet .
docker push localhost:5000/not-scrap-yet
```

# Create Docker for It's Weather Outside
```
cd /Users/geryonghost/gitrepos/itsweatheroutside/app
docker build --tag localhost:5000/its-weather-outside .
docker push localhost:5000/its-weather-outside
```

# Nginx Ingress Controller
`helm upgrade --install ingress-nginx ingress-nginx --repo https://kubernetes.github.io/ingress-nginx --namespace ingress-nginx --create-namespace`

# Cert Manager
```
helm repo add jetstack https://charts.jetstack.io
helm repo update
kubectl create namespace cert-manager
helm install cert-manager jetstack/cert-manager --namespace cert-manager --version v1.13.2
kubectl apply -f clusterissuer.yaml
```

# Kubernetes namespace
`kubectl create namespace comtily`

# Deploy Not Scrap Yet
`kubectl apply -f notscrapyet.yaml`

# Deploy It's Weather Outside
`kubectl apply -f itsweatheroutside.yaml`

# Configure DNS
```
notscrapyet.comtily.com
weather.comtily.com
```

# Nginx Ingress
`kubectl apply -f ingress.yaml`

# Local Hosts
`sudo nano /private/etc/hosts`


