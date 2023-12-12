FROM --platform= summerwind/actions-runner-dind:latest




# FROM mcr.microsoft.com/dotnet/runtime-deps:6.0 as build

# # Replace value with the latest runner release version
# # source: https://github.com/actions/runner/releases
# # ex: 2.303.0
# ARG RUNNER_VERSION="2.311.0"
# ARG RUNNER_ARCH="arm64"
# # Replace value with the latest runner-container-hooks release version
# # source: https://github.com/actions/runner-container-hooks/releases
# # ex: 0.3.1
# ARG RUNNER_CONTAINER_HOOKS_VERSION="0.5.0"

# ENV DEBIAN_FRONTEND=noninteractive
# ENV RUNNER_MANUALLY_TRAP_SIG=1
# ENV ACTIONS_RUNNER_PRINT_LOG_TO_STDOUT=1

# RUN apt update -y && apt install curl unzip -y

# # Add Docker's official GPG key:
# RUN apt-get update && \
# apt-get install ca-certificates curl gnupg -y && \
# install -m 0755 -d /etc/apt/keyrings && \
# curl -fsSL https://download.docker.com/linux/ubuntu/gpg | gpg --dearmor -o /etc/apt/keyrings/docker.gpg && \
# chmod a+r /etc/apt/keyrings/docker.gpg && \
# # Add the repository to Apt sources:
# echo \
#   "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.gpg] https://download.docker.com/linux/ubuntu \
#   $(. /etc/os-release && echo "$VERSION_CODENAME") stable" | \
#   tee /etc/apt/sources.list.d/docker.list > /dev/null && \
# apt-get update && \
# apt-get install docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin

# RUN adduser --disabled-password --gecos "" --uid 1001 runner \
#     && groupadd docker --gid 123 \
#     && usermod -aG sudo runner \
#     && usermod -aG docker runner \
#     && echo "%sudo   ALL=(ALL:ALL) NOPASSWD:ALL" > /etc/sudoers \
#     && echo "Defaults env_keep += \"DEBIAN_FRONTEND\"" >> /etc/sudoers

# WORKDIR /home/runner

# RUN curl -f -L -o runner.tar.gz https://github.com/actions/runner/releases/download/v${RUNNER_VERSION}/actions-runner-linux-${RUNNER_ARCH}-${RUNNER_VERSION}.tar.gz \
#     && tar xzf ./runner.tar.gz \
#     && rm runner.tar.gz

# RUN curl -f -L -o runner-container-hooks.zip https://github.com/actions/runner-container-hooks/releases/download/v${RUNNER_CONTAINER_HOOKS_VERSION}/actions-runner-hooks-k8s-${RUNNER_CONTAINER_HOOKS_VERSION}.zip \
#     && unzip ./runner-container-hooks.zip -d ./k8s \
#     && rm runner-container-hooks.zip

# USER runner
