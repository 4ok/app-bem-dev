#
# Actions:
#
#    build      Build application
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

# Last build name
LAST_BUILD_NAME ?= build

# Build directory
LAST_BUILD_DIR ?= $(LAST_BUILD_NAME)

# Build archive
BUILD_ARCHIVE ?= $(LAST_BUILD_DIR).tgz

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

# Make build
.PHONY: build
build: build.remove \
       build.create.dir \
       build.copy.bem \
       build.copy.app \
       build.copy.makefiles \
       build.copy.install-instructions \
       build.copy.public-files \
       build.gzip.public-files \
       build.gzip

# Remove build directory and archive
.PHONY: build.remove
build.remove:
	$(call printActionTitle,Removing build directory and archive)

	rm -rf $(LAST_BUILD_DIR)
	rm -rf $(BUILD_ARCHIVE)

# Create empty build directory
.PHONY: build.create.dir
build.create.dir:
	$(call printActionTitle,Creating empty build directory)

	mkdir $(LAST_BUILD_DIR)

# Copy bem files
.PHONY: build.copy.bem
build.copy.bem:
	$(call printActionTitle,Copying bem files)

	mkdir -p $(LAST_BUILD_DIR)/$(BUNDLE_DIR)
	cp $(BUNDLE_DIR)/$(BUNDLE_FILE).bemtree.min.js $(LAST_BUILD_DIR)/$(BUNDLE_DIR)
	cp $(BUNDLE_DIR)/$(BUNDLE_FILE).bemhtml.min.js $(LAST_BUILD_DIR)/$(BUNDLE_DIR)

	cp $(BEM_LINKS_FILE) $(LAST_BUILD_DIR)/$(BEM_LINKS_FILE)

# Copy application files
.PHONY: build.copy.app
build.copy.app:
	$(call printActionTitle,Copying application files)

	cp index.js $(LAST_BUILD_DIR)

	cp -r routes $(LAST_BUILD_DIR)
	cp -r src $(LAST_BUILD_DIR)

	mkdir -p $(LAST_BUILD_DIR)/$(CONFIG_NODE_DIR)
	cp $(CONFIG_NODE_DIR)/default*.js $(LAST_BUILD_DIR)/$(CONFIG_NODE_DIR)
	cp $(CONFIG_NODE_DIR)/$(BUILD_ENV)*.js $(LAST_BUILD_DIR)/$(CONFIG_NODE_DIR)

# Copy makefiles
.PHONY: build.copy.makefiles
build.copy.makefiles:
	$(call printActionTitle,Copying makefiles)

	mkdir $(LAST_BUILD_DIR)/makefiles
	find makefiles -type d -d 1 -exec cp -rf {} $(LAST_BUILD_DIR)/makefiles \;
	cp makefiles/$(BUILD_ENV) $(LAST_BUILD_DIR)/Makefile

# Copy install instructions files
.PHONY: build.copy.install-instructions
build.copy.install-instructions:
	$(call printActionTitle,Copying install instructions files)

	cp bower.json $(LAST_BUILD_DIR)
	cp .bowerrc $(LAST_BUILD_DIR)
	cp package.json $(LAST_BUILD_DIR)

 # Copy public files
.PHONY: build.copy.public-files
build.copy.public-files:
	$(call printActionTitle,Copying public files)

	find $(PUBLIC_DIR) -type f ! -name '.*' \
	    | grep -Ev '/.+\.($(OPTIMIZE_IMAGES_SUFFIXES))$$' \
	    | xargs -I {} rsync -R {} $(LAST_BUILD_DIR)/

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
            --out-dir $(LAST_BUILD_DIR)/{} \;

# Gzip public text files
.PHONY: build.gzip.public-files
build.gzip.public-files:
	$(call printActionTitle,Gziping public text files)

	find $(LAST_BUILD_DIR)/public \
	    | grep -E '\.($(COMPRESS_FILES_SUFFIXES))' \
	    | xargs gzip -kv9

# Gzip build directory
.PHONY: build.gzip
build.gzip:
	$(call printActionTitle,Gziping build dir)

	tar -czPf $(BUILD_ARCHIVE) $(LAST_BUILD_DIR)
