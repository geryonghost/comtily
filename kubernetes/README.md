# Install Rancher Desktop
`brew install rancher`

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

# Test VPN Connectivity
ssh and kubectl via ssh

# Install OhMyZSH
`sh -c "$(curl -fsSL https://raw.github.com/robbyrussell/oh-my-zsh/master/tools/install.sh)"`

# Install PowerLevel10k
git clone https://github.com/romkatv/powerlevel10k.git $ZSH_CUSTOM/themes/powerlevel10k



# Install Helm
`brew install helm`

# Install K9s
`brew install k9s`

# Install Git
`brew install git`

# Configure Git
`mkdir gitrepos`
`git config --global commit.gpgsign true`
`git config --global user.signingkey ~/.ssh/<id>.pub`
`git config --global gpg.format ssh`

# Clone Repos
`git clone git@github.com:geryonghost/comtily.git`
`git clone git@github.com:geryonghost/notscrapyet.git`
`git clone git@github.com:geryonghost/itsweatheroutside.git`

# Local Docker Registry 
`docker run -d -p 5000:5000 --restart=always --name=comtilyhub registry`

# Create Docker for Not Scrap Yet
```
cd /Users/geryonghost/gitrepos/notscrapyet/app
docker build --tag localhost:5000/not-scrap-yet:0001.0001 .
docker push localhost:5000/not-scrap-yet:0001.0001
```

# Create Docker for It's Weather Outside
```
cd /Users/geryonghost/gitrepos/itsweatheroutside/app
docker build --tag localhost:5000/its-weather-outside:0001.0001 .
docker push localhost:5000/its-weather-outside:0001.0001
```

# Nginx Ingress Controller
`helm upgrade --install ingress-nginx ingress-nginx --repo https://kubernetes.github.io/ingress-nginx --namespace ingress-nginx --create-namespace`

# Cert Manager
```
cd /Users/geryonghost/gitrepos/comtily/kubernetes
helm repo add jetstack https://charts.jetstack.io
helm repo update
kubectl create namespace cert-manager
kubectl apply -f https://github.com/cert-manager/cert-manager/releases/download/v1.13.2/cert-manager.crds.yaml
helm install cert-manager jetstack/cert-manager --namespace cert-manager --version v1.13.2
kubectl apply -f clusterissuer.yaml
```

# Create Comtily namespace
`kubectl create namespace comtily`

# Create Persistent Storage
`kubectl apply -f persistenvolumeclaims.yaml`

# Create MongoDB
`kubectl apply -f mongodb.yaml`

# Create Postgres DB
`kubectl apply -f postgres.yaml`

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


