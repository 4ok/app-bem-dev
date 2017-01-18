#
# Actions:
#
#    bem    Assemble bem bundles
#    clean  Clean assembled files
#

########################################################
###                     Variables                    ###
########################################################

# Node modules directory
NODE_MODULES_DIR ?= node_modules

# Node modules binary directory
NODE_MODULES_BIN_DIR ?= $(NODE_MODULES_DIR)/.bin

# Enb
ENB ?= $(NODE_MODULES_BIN_DIR)/enb

# Borschik
BORSCHIK ?= $(NODE_MODULES_BIN_DIR)/borschik

# The bem directory
BEM_DIR ?= bem

# The static directory
STATIC_DIR ?= public/static

########################################################
###                     Functions                    ###
########################################################

#
# Print the title of action
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
###                     Bem rules                    ###
########################################################

# Make bem
.PHONY: bem
bem: static-dir.delete bem-configs.create bem-make freeze-links

# Assemble bem
.PHONY: bem-make
bem-make:
	$(ENB) make ${tech} --no-cache --dir $(BEM_DIR)

# Create bem configs
.PHONY: bem-configs.create
bem-configs.create:
	$(call printActionTitle,Creating bem configs)

	ln -sf $(PWD)/$(NODE_MODULES_DIR)/app-bem-dev/borschik.json $(PWD)/$(BEM_DIR)/.borschik

# Freeze links
.PHONY: freeze-links
freeze-links:
	ln -sf $(PWD)/$(NODE_MODULES_DIR)/app-bem-dev/links.json $(PWD)/$(BEM_DIR)/links.tmp.json
	$(BORSCHIK) -t json -i $(BEM_DIR)/links.tmp.json -o $(BEM_DIR)/links.json
	rm $(BEM_DIR)/links.tmp.json

# Create the static directory
.PHONY: static-dir.create
static-dir.create:
	$(call printActionTitle,Сreating static dir)

	mkdir -p $(STATIC_DIR)

########################################################
###                 Bem clean rules                  ###
########################################################

# Clean
.PHONY: clean
clean: bem-configs.delete static-dir.delete bundles.delete temp-files.delete

# Delete bundles
.PHONY: bundles.delete
bundles.delete:
	$(call printActionTitle,Cleaning bem bundles)

	$(ENB) make clean --dir $(BEM_DIR)

# Delete bem configs
.PHONY: bem-configs.delete
bem-configs.delete:
	$(call printActionTitle,Deleting bem configs)

	rm -f $(BEM_DIR)/.borschik
	rm -f $(BEM_DIR)/links.json

# Delete the static directory
.PHONY: static-dir.delete
static-dir.delete:
	$(call printActionTitle,Deleting the static dir)

	rm -rf $(STATIC_DIR)

# Delete temporary files
.PHONY: temp-files.delete
temp-files.delete:
	$(call printActionTitle,Deleting temporary files)

	rm -rf $(BEM_PATH)/.enb/tmp


