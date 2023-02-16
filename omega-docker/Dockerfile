FROM ubuntu:latest

RUN apt-get update && \
    apt-get install -y git python3 build-essential cmake nodejs npm && \
    ln -s /usr/bin/python3 /usr/bin/python

# Install emsdk
RUN git clone https://github.com/emscripten-core/emsdk.git && \
    cd emsdk && \
    ./emsdk install latest-fastcomp && \
    ./emsdk activate latest-fastcomp && \
    echo "source emsdk_env.sh" >> ~/.bashrc && \
    /bin/bash -c "source ~/.bashrc"

# Clone and build Omega
RUN git clone --recursive https://github.com/Omega-Numworks/Omega.git && \
    cd Omega && \
    git checkout omega-master && \
    make clean && \
    make PLATFORM=simulator TARGET=web OMEGA_USERNAME="papillon" -j4 && \
    zip -r omega-web.zip web

EXPOSE 8000

CMD ["python3", "-m", "http.server", "--cgi", "8000"]
