#
# Actions:
#
#    build      Create a release build
#

########################################################
###                     Variables                    ###
########################################################

# Project name
PROJECT_NAME ?= $(shell jq -r '.name' package.json)

# Node modules directory
NODE_MODULES_DIR ?= node_modules

# Node modules binary directory
NODE_MODULES_BIN_DIR ?= $(NODE_MODULES_DIR)/.bin

# Image optimize module
IMAGEMIN ?= $(NODE_MODULES_BIN_DIR)/imagemin

# Bem directory
BEM_DIR ?= bem

# Configs directory
CONFIGS_DIR ?= configs

# Node config directory
CONFIG_NODE_DIR ?= $(CONFIGS_DIR)/node

# Bem links
BEM_LINKS_FILE ?= $(BEM_DIR)/links.json

# Bundle directory
BUNDLE_DIR ?= bem/bundles/index

# Bundle file
BUNDLE_FILE ?= index

# Public directory
PUBLIC_DIR ?= public

# Release name
RELEASE_NAME ?= release

# Release directory
RELEASE_DIR ?= $(RELEASE_NAME)

# Files suffixes for compress
COMPRESS_FILES_SUFFIXES ?= css|js|eot|svg|ttf|woff|pdf|xml|txt

# Images suffixes for optimize
OPTIMIZE_IMAGES_SUFFIXES ?= jpg|jpeg|png|gif|svg

# Images suffixes for optimize
OPTIMIZE_IMAGES ?= jpg jpeg png gif svg

########################################################
###                      Export                      ###
########################################################

# Gzip compress level
export GZIP ?= -9

# Enb make is minify files
export ENB_IS_MINIFY ?= 1

# Build environment
export BUILD_ENV ?= production

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
###                     Copy rules                   ###
########################################################

# Make a release build
.PHONY: build
build: build.remove.release-dir \
       build.create.release-dir \
       build.copy.bem-files \
       build.copy.app-files \
       build.copy.makefiles \
       build.copy.install-instructions-files \
       build.copy.optimize-public-images \
       build.copy.not-images-public-files \
       build.gzip.public-files

# Remove a release directory
.PHONY: build.remove.release-dir
build.remove.release-dir:
	$(call printActionTitle,Removing release directory)

	rm -rf $(RELEASE_DIR)

# Create an empty release directory
.PHONY: build.create.release-dir
build.create.release-dir:
	$(call printActionTitle,Creating an empty release directory)

	mkdir $(RELEASE_DIR)

# Copy bem files
.PHONY: build.copy.bem-files
build.copy.bem-files:
	$(call printActionTitle,Copying bem files)

	mkdir -p $(RELEASE_DIR)/$(BUNDLE_DIR)
	cp $(BUNDLE_DIR)/$(BUNDLE_FILE).bemtree.min.js $(RELEASE_DIR)/$(BUNDLE_DIR)
	cp $(BUNDLE_DIR)/$(BUNDLE_FILE).bemhtml.min.js $(RELEASE_DIR)/$(BUNDLE_DIR)

	cp $(BEM_LINKS_FILE) $(RELEASE_DIR)/$(BEM_LINKS_FILE)

# Copy application files
.PHONY: build.copy.app-files
build.copy.app-files:
	$(call printActionTitle,Copying application files)

	cp index.js $(RELEASE_DIR)

	cp -r routes $(RELEASE_DIR)
	cp -r src $(RELEASE_DIR)

	mkdir -p $(RELEASE_DIR)/$(CONFIG_NODE_DIR)
	cp $(CONFIG_NODE_DIR)/default*.js $(RELEASE_DIR)/$(CONFIG_NODE_DIR)
	cp $(CONFIG_NODE_DIR)/$(BUILD_ENV)*.js $(RELEASE_DIR)/$(CONFIG_NODE_DIR)

# Copy makefiles
.PHONY: build.copy.makefiles
build.copy.makefiles:
	$(call printActionTitle,Copying makefiles)

	mkdir $(RELEASE_DIR)/makefiles
	find makefiles -type d -d 1 -exec cp -rf {} $(RELEASE_DIR)/makefiles \;
	cp makefiles/$(BUILD_ENV) $(RELEASE_DIR)/Makefile

# Copy install instructions files
.PHONY: build.copy.install-instructions-files
build.copy.install-instructions-files:
	$(call printActionTitle,Copying install instructions files)

	cp bower.json $(RELEASE_DIR)
	cp .bowerrc $(RELEASE_DIR)
	cp package.json $(RELEASE_DIR)

 # Copy not images public files
.PHONY: build.copy.not-images-public-files
build.copy.not-images-public-files:
	$(call printActionTitle,Copying not images public files)

	find $(PUBLIC_DIR) -type f ! -name '.*' \
	    | grep -Ev '/.+\.($(OPTIMIZE_IMAGES_SUFFIXES))$$' \
	    | xargs -I {} rsync -R {} $(RELEASE_DIR)/

########################################################
###                   Minify rules                   ###
########################################################

# Optimize and copy public images
.PHONY: build.copy.optimize-public-images
build.copy.optimize-public-images:
	$(call printActionTitle,Optimizing and copying public images)

	find public -type f \
	    | grep -E '\.($(OPTIMIZE_IMAGES_SUFFIXES))' \
	    | sed -E 's|/[^/]+$$|/|' \
	    | uniq \
	    | xargs -I {} \
	    $(IMAGEMIN) {}/* \
            --plugin mozjpeg \
            --plugin pngquant \
            --plugin gifsicle \
            --plugin svgo \
            --out-dir $(RELEASE_DIR)/{} \;

# Gzip public text files
.PHONY: build.gzip.public-files
build.gzip.public-files:
	$(call printActionTitle,Gziping public text files)

	find $(RELEASE_DIR)/public \
	    | grep -E '\.($(COMPRESS_FILES_SUFFIXES))' \
	    | xargs gzip -kv9
