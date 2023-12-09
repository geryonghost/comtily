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
docker build --tag localhost:5000/notscrapyet .
docker push localhost:5000/notscrapyet
```

# Create Docker for It's Weather Outside
```
cd /Users/geryonghost/gitrepos/itsweatheroutside/app
docker build --tag localhost:5000/itsweatheroutside .
docker push localhost:5000/itsweatheroutside
```

# Create Docker for Skygate Security
```
cd /Users/geryonghost/gitrepos/skygatesecurity/static
docker build --tag localhost:5000/skygatesecurity .
docker push localhost:5000/skygatesecurity
```

# Nginx Ingress Controller
`helm upgrade --install ingress-nginx ingress-nginx --repo https://kubernetes.github.io/ingress-nginx --namespace ingress-nginx --create-namespace`

# GitHub Actions ARC
```
cd /Users/geryonghost/gitrepos/comtily/kubernetes

kubectl create namespace github-actions
kubectl create namespace github-actions-runners

kubectl create secret generic gha-arc \
   --namespace=github-actions \
   --from-literal=github_app_id=678307 \
   --from-literal=github_app_installation_id=44839055 \
   --from-literal=github_app_private_key=''


kubectl create secret generic gha-arc \
   --namespace=github-actions-runners \
   --from-literal=github_app_id=678307 \
   --from-literal=github_app_installation_id=44839055 \
   --from-literal=github_app_private_key=''

helm upgrade --install arc \
    oci://ghcr.io/actions/actions-runner-controller-charts/gha-runner-scale-set-controller \
    --namespace github-actions \
    --set githubConfigSecret=gha-arc

helm upgrade --install arc-runner-set \
    oci://ghcr.io/actions/actions-runner-controller-charts/gha-runner-scale-set \
    --namespace github-actions-runners \
    --set githubConfigUrl="https://github.com/geryonghost/itsweatheroutside" \
    --set githubConfigSecret=gha-arc
```

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

# Deploy Not Scrap Yet
```
cd /Users/geryonghost/gitrepos/notscrapyet/deployment/dev
kubectl apply -f deployment.yaml
```

# Deploy It's Weather Outside
```
cd /Users/geryonghost/gitrepos/itsweatheroutside/deployment/dev
kubectl apply -f deployment.yaml
```

# Configure DNS
```
dev.notscrapyet.com
dev.itsweatheroutside.com
```

# Nginx Ingress
`kubectl apply -f ingress.yaml`

# Configure DNS
```
dev.notscrapyet.com
dev.itsweatheroutside.com
```

# Local Hosts
`sudo nano /private/etc/hosts`
```
127.0.0.1   dev.notscrapyet.com
127.0.0.1   dev.itsweatheroutside.com
```


