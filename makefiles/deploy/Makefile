#
# Actions:
#
#    deploy     Deploy build
#

########################################################
###                     Variables                    ###
########################################################

ifndef SERVER_HOST
    $(error Variable SERVER_HOST isn't defined)
endif

ifndef REMOTE_BUILD_NAME
    $(error Variable REMOTE_BUILD_NAME isn't defined)
endif

# Project name
PROJECT_NAME ?= $(shell jq -r '.name' package.json)

# Local build directory
LOCAL_BUILD_DIR ?= build

# Loal build archive
LOCAL_BUILD_ARCHIVE ?= build.tgz

# Remote www root
REMOTE_WWW_ROOT ?= /var/www

# Remote builds directory
REMOTE_BUILDS_DIR ?= $(REMOTE_WWW_ROOT)/builds

# Remote projects directory
REMOTE_PROJECTS_DIR ?= $(REMOTE_WWW_ROOT)/projects

# Remote build archive
REMOTE_BUILD_ARCHIVE ?= $(REMOTE_BUILDS_DIR)/$(REMOTE_BUILD_NAME).tgz

# Remote build directory
REMOTE_BUILD_DIR ?= $(REMOTE_BUILDS_DIR)/$(REMOTE_BUILD_NAME)

# Remote project directory
REMOTE_PROJECT_DIR ?= $(REMOTE_PROJECTS_DIR)/$(PROJECT_NAME)

########################################################
###                     Functions                    ###
########################################################

#
# Print a title of action
#
# $(1) {String} Title
#
ifndef printActionTitle
define printActionTitle
    $(info )
    $(info =====> $(1))
endef
endif

########################################################
###                   Deploy rules                   ###
########################################################

# Deploy a project
.PHONY: deploy
deploy: build.local.copy-to-remote-builds-dir \
        build.remote.unzip \
        build.remote.install \
        build.remote.remove-archive

# Remove a local build archive
.PHONY: build.local.remove
build.local.remove:
	$(call printActionTitle,Removing a local build archive)

	rm $(LOCAL_BUILD_ARCHIVE)

# Copy a build archive to a remote builds directory
.PHONY: build.local.copy-to-remote-builds-dir
build.local.copy-to-remote-builds-dir:
	$(call printActionTitle,Coping a build archive to a remote builds directory)

	scp $(LOCAL_BUILD_ARCHIVE) fast-vps:$(REMOTE_BUILD_ARCHIVE)

# Unzip remote build
.PHONY: build.remote.unzip
build.remote.unzip:
	$(call printActionTitle,Unziping remote build)

	ssh $(SERVER_HOST) ' \
	    rm -rf $(REMOTE_BUILD_DIR) \
	    && mkdir $(REMOTE_BUILD_DIR) \
        && tar \
            -C $(REMOTE_BUILD_DIR) --strip-components 1 \
            -zxf $(REMOTE_BUILD_ARCHIVE) 2>/dev/null \
	    '

# Install modules
.PHONY: build.remote.install
build.remote.install:
	$(call printActionTitle,Installing modules)

	ssh $(SERVER_HOST) 'make --no-print-directory -C $(REMOTE_BUILD_DIR) install'

# Create symlink to a project
.PHONY: build.remote.create-symlink
build.remote.create-symlink:
	$(call printActionTitle,Creating symlink in a project)

	ssh $(SERVER_HOST) 'ln -sfn $(REMOTE_BUILD_DIR) $(REMOTE_PROJECT_DIR)'

# Remove build archive
.PHONY: build.remote.remove-archive
build.remote.remove-archive:
	$(call printActionTitle,Removing build archive)

	ssh $(SERVER_HOST) 'rm -rf $(REMOTE_BUILD_ARCHIVE)'

# Start or restart project
.PHONY: project.remote.startOrRestart
project.remote.startOrRestart:
	$(call printActionTitle,Start or restart project)

	ssh $(SERVER_HOST) 'make --no-print-directory -C $(REMOTE_PROJECT_DIR) startOrRestart'
